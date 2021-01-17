from flask import Blueprint, request, make_response

# initialize routes blueprint
routes = Blueprint("routes", __name__)


# route to post an error to the database
@routes.route("/postError", methods=["POST"])
def post_error():
    try:
        request_body = request.get_json()
        print(request_body)
        return make_response({"message": "success"}, 200)
    except:
        return make_response({"message": "error occurred"}, 500)
    # TODO: log error in database


# route to get suggested car maintenance from CarMD public API
@routes.route("/getSuggestedMaintenance/<vin_number>", methods=["GET"])
def get_suggested_maintenance(vin_number):
    try:
        print(vin_number)
        return make_response({"message": "success"}, 200)
    except:
        return make_response({"message": "error occurred"}, 500)
    # TODO: call public CarMD API to get suggested maintenance


# route to get car recalls from CarMD public API
@routes.route("/getRecalls/<vin_number>", methods=["GET"])
def get_recalls(vin_number):
    try:
        print(vin_number)
        return make_response({"message": "success"}, 200)
    except:
        return make_response({"message": "error occurred"}, 500)
    # TODO: call public CarMD API to get recalls
