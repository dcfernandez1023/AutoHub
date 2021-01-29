from flask import Blueprint, request, make_response
from controllers.controller import Controller

# initialize routes blueprint
routes = Blueprint("routes", __name__)


# DESCRIPTION: route to post an error to the database
# EXPECTED URL PARAMS: none
@routes.route("/api/postError", methods=["POST"])
def post_error():
    try:
        request_body = request.get_json()
        print(request_body)
        controller = Controller()
        return make_response({"message": "success"}, 200)
    except:
        return make_response({"message": "error occurred"}, 500)


# DESCRIPTION: route to get suggested car maintenance from CarMD public API
# EXPECTED URL PARAMS: vin_number & mileage
@routes.route("/api/getSuggestedMaintenance/", methods=["GET"])
def get_suggested_maintenance():
    try:
        request_params = request.args.to_dict()
        controller = Controller()
        response = controller.get_suggested_maintenance(request_params["vin_number"], request_params["mileage"])
        return make_response(response, 200)
    except:
        return make_response({"message": "error occurred"}, 500)


# DESCRIPTION: route to get car recalls from CarMD public API
# EXPECTED URL PARAMS: expected params: vin_number & mileage
@routes.route("/api/getRecalls/<vin_number>", methods=["GET"])
def get_recalls():
    try:
        request_params = request.args.to_dict()
        print(request_params)
        controller = Controller()
        return make_response({"message": "success"}, 200)
    except:
        return make_response({"message": "error occurred"}, 500)
