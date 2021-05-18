from requests import Request, request
import schedule
from datetime import datetime
import time
import tracemalloc
#from scheduler import firebase_access
from firebase_access import Firebaseapp

class Scheduler:
    def __init__(self):
        # headers for public api
        self.carmd_request_headers = \
        {
          "content-type": "application/json",
          "authorization": "Basic YzIxYjg1ODgtOGJiYi00MTk5LWI5NmEtM2UzY2ZmYzRiMzU2",
          "partner-token": "aea9049b168d446c97cdf2bf3511d01f"
        }
        self.__firebaseapp = Firebaseapp()

    def run_jobs(self):
        self.__run_scheduled_jobs()

    def update_suggested_maintenance_and_recalls(self):
        try:
            # get cars from db
            cars = self.__firebaseapp.get_documents("cars", "vinNumber", "!=", "")
            #now = datetime.now()
            # get queue of cars to update
            queue = self.__queue_cars_for_api_rotation(cars)
            # print("Query Executed at: " + now.strftime("%Y-%m-%d %H:%M:%S"))
            # print("###########")
            # print("QUERY RESULTS")
            # for car in cars:
            #     print("~~ Name: " + str(car["name"]) + " | " + "Last Rotation: " + str(car["lastApiRotation"]) + " | " + "VIN: " + str(car["vinNumber"]))
            #     print(car["recalls"])
                # del car["suggestedMaintenance"]
                # del car["recalls"]
                # del car["lastApiRotation"]
            # print("###########")
            # print("")
            # print("###########")
            # print("QUEUE RESULTS")
            for car in queue:
                #print("~~ Name: " + str(car["name"]) + " | " + "Last Rotation: " + str(car["lastApiRotation"]) + " | " + "VIN: " + str(car["vinNumber"]))
                car.update({"lastApiRotation": self.__now_milliseconds()})
                if len(car["recalls"]) == 0:
                    recalls = self.get_recalls(car["vinNumber"])
                    # check if recalls is not the right data type (since data is coming from public api)
                    if recalls is None or not isinstance(recalls, list):
                        continue
                    car.update({"recalls": recalls})
                elif len(car["suggestedMaintenance"]) == 0:
                    maintenance = self.get_suggested_maintenance(car["vinNumber"], car["mileage"])
                    # check if maintenance is not the right data type (since data is coming from public api)
                    if maintenance is None or not isinstance(maintenance, list):
                        continue
                    car.update({"suggestedMaintenance": maintenance})
                else:
                    recalls = self.get_recalls(car["vinNumber"])
                    # check if recalls is not the right data type (since data is coming from public api)
                    if recalls is None or not isinstance(recalls, list):
                        continue
                    car.update({"recalls": recalls})
            #     print("Has recalls: " + str(len(car["recalls"]) == 0) + " | " + "Has Maintenance: " + str(len(car["suggestedMaintenance"]) == 0))
            # print("###########")
            self.__firebaseapp.write_documents("cars", "carId", queue)
            # print("Queue: " + str(queue))
            # print("Query Length: " + str(len(cars)))
            # print("Queue Length: " + str(len(queue)))
            # print("--------")
            self.__write_log()
        except Exception as e:
            self.__write_error(str(e))

    def get_suggested_maintenance(self, vin_number, mileage):
        try:
            url = "http://api.carmd.com/v3.0/maint?vin=" + vin_number + "&mileage=" + str(mileage)
            response = request("GET", url=url, headers=self.carmd_request_headers)
            return response.json()["data"]
        except Exception:
            return []

    def get_recalls(self, vin_number):
        try:
            url = "http://api.carmd.com/v3.0/recall?vin=" + vin_number
            response = request("GET", url=url, headers=self.carmd_request_headers)
            return response.json()["data"]
        except Exception:
            return []

    # enqueues cars to be updated
    def __queue_cars_for_api_rotation(self, cars):
        try:
            queue = []
            current_cars = {}
            max_api_calls = 5
            # enqueue cars that do not have suggested maintenance or recalls FIRST
            for car in cars:
                # series of if statements to account for the fields not existing (preventing any errors)
                if not "suggestedMaintenance" in car:
                    car.update({"suggestedMaintenance": []})
                if not "recalls" in car:
                    car.update({"recalls": []})
                if not "lastApiRotation" in car:
                    car.update({"lastApiRotation": -1})
                if len(car["suggestedMaintenance"]) == 0 and len(car["recalls"]) == 0 or car["lastApiRotation"] == -1:
                    if len(queue) < max_api_calls and not car["carId"] in current_cars:
                        queue.append(car)
                        current_cars.update({car["carId"]: True})
            # function to modify python's list.sort method
            def sort_by(ele):
                return int(ele["lastApiRotation"])
            cars.sort(key=sort_by)
            # enqueue cars that have not been updated recently
            for car in cars:
                if not car["carId"] in current_cars and len(queue) < max_api_calls:
                    queue.append(car)
                    current_cars.update({car["carId"]: True})
            return queue
        except Exception as e:
            self.__write_error(str(e))
            return []

    def __now_milliseconds(self):
        return int(time.time() * 1000)

    def __write_error(self, error_msg):
        error_log = open("../error_log.txt", "a")
        error_log.write(str(error_msg) + '\n')
        error_log.close()

    def __write_log(self):
        now = datetime.now()
        file = open("../log.txt", "a")
        file.write("Job Executed at: " + now.strftime("%Y-%m-%d %H:%M:%S") + '\n')
        file.close()

    def __trace_memory(self):
        tracemalloc.start()
        current, peak = tracemalloc.get_traced_memory()
        print(f"Current memory usage is {current / 10**6}MB; Peak was {peak / 10**6}MB")

    def __run_scheduled_jobs(self):
        schedule.every(1).days.do(self.update_suggested_maintenance_and_recalls)
        #schedule.every(5).seconds.do(self.__trace_memory)
        #tracemalloc.stop()
        while True:
            schedule.run_pending()
        #self.update_suggested_maintenance_and_recalls()
