from requests import Request, request
import schedule
import time
from crontab import *

class Controller:
    def __init__(self):
        self.carmd_request_headers = \
        {
          "content-type": "application/json",
          "authorization": "Basic YzIxYjg1ODgtOGJiYi00MTk5LWI5NmEtM2UzY2ZmYzRiMzU2",
          "partner-token": "aea9049b168d446c97cdf2bf3511d01f"
        }
        self.__initialize_scheduled_jobs()

    def update_suggested_maintenance_and_recalls(self):
        users = self.__get_users()
        now = datetime.now()
        print("Scheduled Job Executed at: " + now.strftime("%Y-%m-%d %H:%M:%S"))
        # TODO: loop through and update users' cars with suggested_maintenance and/or recalls


    def get_suggested_maintenance(self, vin_number, mileage):
        url = "http://api.carmd.com/v3.0/maint?vin=1GNALDEK9FZ108495&mileage=51000"
        response = request("GET", url=url, headers=self.carmd_request_headers)
        return response.json()

    def get_recalls(self, vin_number, mileage):
        # TODO: call public CarMD API to get recalls
        return

    def __get_users(self):
        users = ["user1", "user2", "user3"]
        # TODO: query users from Firebase cloud Firestore
        return users

    def __initialize_scheduled_jobs(self):
        schedule.every(10).seconds.do(self.update_suggested_maintenance_and_recalls)
        while True:
            schedule.run_pending()
