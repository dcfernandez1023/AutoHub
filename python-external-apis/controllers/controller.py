from requests import Request, request
import schedule
from datetime import datetime
import time
from controllers import firebase_access

class Controller:
    def __init__(self):
        self.carmd_request_headers = \
        {
          "content-type": "application/json",
          "authorization": "Basic YzIxYjg1ODgtOGJiYi00MTk5LWI5NmEtM2UzY2ZmYzRiMzU2",
          "partner-token": "aea9049b168d446c97cdf2bf3511d01f"
        }
        self.__firebaseapp = firebase_access.firebaseapp()
        self.__initialize_scheduled_jobs()

    def update_suggested_maintenance_and_recalls(self):
        cars = self.__firebaseapp.get_documents("cars", "vinNumber", "!=", "")
        now = datetime.now()
        queue = self.__queue_cars_for_api_rotation(cars)
        print("Query Executed at: " + now.strftime("%Y-%m-%d %H:%M:%S"))
        print("Query Results: " + str(cars))
        for car in queue:
            car.update({"lastApiRotation": self.__now_milliseconds()})
        print("Queue: " + str(queue))
        print("Query Length: " + str(len(cars)))
        print("Queue Length: " + str(len(queue)))
        print("--------")
        # TODO: loop through and update users' cars with suggested_maintenance and/or recalls


    def get_suggested_maintenance(self, vin_number, mileage):
        url = "http://api.carmd.com/v3.0/maint?vin=1GNALDEK9FZ108495&mileage=51000"
        response = request("GET", url=url, headers=self.carmd_request_headers)
        return response.json()

    def get_recalls(self, vin_number, mileage):
        # TODO: call public CarMD API to get recalls
        return

    def __queue_cars_for_api_rotation(self, cars):
        queue = []
        current_cars = {}
        max_api_calls = 5
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
        for i in range(len(cars)):
            car = cars[i]
            for j in range(len(cars)):
                if i != j and cars[j]["lastApiRotation"] is not None and car["lastApiRotation"] is not None:
                    if cars[j]["lastApiRotation"] < car["lastApiRotation"]:
                        if len(queue) < max_api_calls and not car["carId"] in current_cars:
                            queue.append(car)
                            current_cars.update({car["carId"]: True})
        return queue

    def __now_milliseconds(self):
        return int(time.time() * 1000)

    def __initialize_scheduled_jobs(self):
        # schedule.every(5).seconds.do(self.update_suggested_maintenance_and_recalls)
        # while True:
        #     schedule.run_pending()
        self.update_suggested_maintenance_and_recalls()
