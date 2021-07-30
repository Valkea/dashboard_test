#! usr/bin/etc python3
# coding=utf-8

from flask import Flask, render_template, jsonify

app = Flask(__name__)


@app.route("/")
def index():
    return "Hello World!"


@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")


@app.route("/api/meteo")
def meteo():
    dictionnaire = {
        "type": "Prévision de temperature",
        "valeurs": [24, 25, 22, 20, 18, 26, 30],
        "unite": "Degrés Celcius",
    }

    return jsonify(dictionnaire)


if __name__ == "__main__":
    app.run(debug=True)  # TODO supprimer le mode debug
