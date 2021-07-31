#! usr/bin/etc python3
# coding=utf-8

import requests
import json

from flask import Flask, render_template, jsonify

app = Flask(__name__)

with open('openweather.key', 'r') as f:
    OPEN_WEATHER_KEY = f.readline()


@app.route("/")
def index():
    return f"Hello World! {OPEN_WEATHER_KEY}"


@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")


@app.route("/api/meteo")
def meteo():

    response = requests.get(METEO_API_URL)
    content = json.loads(response.content.decode("utf-8"))

    if response.status_code != 200:
        return (
            jsonify(
                {
                    "status": "error",
                    "message": "La requête à l'API météo n'a pas fonctionné. Voici le message renvoyé par l'API : {}".format(
                        content["message"]
                    ),
                }
            ),
            500,
        )

    data = []  # On initialise une liste vide
    for prev in content["list"]:
        datetime = prev["dt"] * 1000
        temperature = prev["main"]["temp"] - 273.15  # Conversion de Kelvin en °c
        temperature = round(temperature, 2)
        data.append([datetime, temperature])

    return jsonify({"status": "ok", "data": data})


if __name__ == "__main__":
    app.run(debug=True)  # TODO supprimer le mode debug
