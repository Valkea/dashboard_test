from flask import Flask

app = Flask(__name__)


@app.route("/")
def index():
    return "Hello World!"


@app.route("/dashboard")
def dashboard():
    return "Ici c'est le dashboard"


if __name__ == "__main__":
    app.run(debug=True)
