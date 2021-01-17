from flask import Flask
from routes import routes

# initialize app and register routes blueprint
app = Flask(__name__)
app.register_blueprint(routes)


if __name__ == "__main__":
    app.run(host="localhost", port=8080, debug=True)
