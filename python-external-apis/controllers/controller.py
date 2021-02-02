from requests import Request, request
import schedule
from datetime import datetime
import time
#from controllers import firebase_access
from firebase_access import Firebaseapp

class Controller:
    def __init__(self):
        self.carmd_request_headers = \
        {
          "content-type": "application/json",
          "authorization": "Basic YzIxYjg1ODgtOGJiYi00MTk5LWI5NmEtM2UzY2ZmYzRiMzU2",
          "partner-token": "aea9049b168d446c97cdf2bf3511d01f"
        }
        self.__firebaseapp = Firebaseapp()
        self.__initialize_scheduled_jobs()

    def update_suggested_maintenance_and_recalls(self):
        cars = self.__firebaseapp.get_documents("cars", "vinNumber", "!=", "")
        now = datetime.now()
        queue = self.__queue_cars_for_api_rotation(cars)
        print("Query Executed at: " + now.strftime("%Y-%m-%d %H:%M:%S"))
        print("###########")
        print("QUERY RESULTS")
        for car in cars:
            print("~~ Name: " + str(car["name"]) + " | " + "Last Rotation: " + str(car["lastApiRotation"]) + " | " + "VIN: " + str(car["vinNumber"]))
        print("###########")
        print("")
        print("###########")
        print("QUEUE RESULTS")
        for car in queue:
            print("~~ Name: " + str(car["name"]) + " | " + "Last Rotation: " + str(car["lastApiRotation"]) + " | " + "VIN: " + str(car["vinNumber"]))
            car.update({"lastApiRotation": self.__now_milliseconds()})
            if len(car["recalls"]) == 0:
                arr = car["recalls"]
                arr.append("recall")
                car.update({"recalls": arr})
            elif len(car["suggestedMaintenance"]) == 0:
                arr = car["suggestedMaintenance"]
                arr.append("maintenance")
                car.update({"suggestedMaintenance": arr})
            else:
                arr = car["recalls"]
                arr.append("recall")
                car.update({"recalls": arr})
        print("###########")
        self.__firebaseapp.write_documents("cars", "carId", queue)
        print("Queue: " + str(queue))
        print("Query Length: " + str(len(cars)))
        print("Queue Length: " + str(len(queue)))
        print("--------")
        # TODO: loop through and update users' cars with suggested_maintenance and/or recalls


    def get_suggested_maintenance(self, vin_number):
        url = "http://api.carmd.com/v3.0/maintlist?vin=" + vin_number
        response = request("GET", url=url, headers=self.carmd_request_headers)
        return response.json()

    def get_recalls(self, vin_number, mileage):
        # TODO: call public CarMD API to get recalls
        return

    def __queue_cars_for_api_rotation(self, cars):
        queue = []
        current_cars = {}
        max_api_calls = 5
        # enqueue cars that do not have suggested maintenance or recalls FIRST
        for car in cars:
            if not "suggestedMaintenance" in car:
                car.update({"suggestedMaintenance": []})
            if not "recalls" in car:
                car.update({"recalls": []})
            if not "lastApiRotation" in car:
                car.update({"lastApiRotation": None})
            if len(car["suggestedMaintenance"]) == 0 and len(car["recalls"]) == 0 or car["lastApiRotation"] is None:
                if len(queue) < max_api_calls and not car["carId"] in current_cars:
                    queue.append(car)
                    current_cars.update({car["carId"]: True})
        # enqueue cars that have not been updated most recently
        for i in range(len(cars)):
            oldest = cars[i]
            for j in range(len(cars)):
                if i != j and cars[j]["lastApiRotation"] is not None and oldest["lastApiRotation"] is not None:
                    if cars[j]["lastApiRotation"] < oldest["lastApiRotation"]:
                        oldest = cars[j]
            if len(queue) < max_api_calls and not oldest["carId"] in current_cars:
                queue.append(oldest)
                current_cars.update({oldest["carId"]: True})
        return queue

    def __now_milliseconds(self):
        return int(time.time() * 1000)

    def __initialize_scheduled_jobs(self):
        # schedule.every(5).seconds.do(self.update_suggested_maintenance_and_recalls)
        # while True:
        #     schedule.run_pending()
        self.update_suggested_maintenance_and_recalls()
