from flask import Flask
from controllers.routes import routes
from controllers import controller

# initialize app and register routes blueprint
app = Flask(__name__)
app.register_blueprint(routes)

if __name__ == "__main__":
    # testing cron job
    app.run(host="localhost", port=8080, debug=True)
    c = controller.Controller()
