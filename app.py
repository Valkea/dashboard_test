#! usr/bin/etc python3
# coding=utf-8

import requests
import json

from flask import Flask, render_template, jsonify

from functions import extract_keywords


app = Flask(__name__)


# --- LOAD API KEYS ---

with open("openweather.key", "r") as f:
    OPEN_WEATHER_KEY = f.readline().strip()

METEO_API_URL = (
    "https://api.openweathermap.org/data/2.5/forecast?lat=48.883587&lon=2.333779&appid="
    + OPEN_WEATHER_KEY
)


with open("newsapi.key", "r") as f:
    NEWS_API_KEY = f.readline().strip()

NEWS_API_URL = "https://newsapi.org/v2/top-headlines?country=fr&apiKey=" + NEWS_API_KEY


# --- DEFINE ROUTES ---


@app.route("/")
def index():
    return f"Hello World! {METEO_API_URL}\n{NEWS_API_URL}"


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


@app.route("/api/news")
def news():

    response = requests.get(NEWS_API_URL)
    content = json.loads(response.content.decode("utf-8"))

    if response.status_code != 200:
        return (
            jsonify(
                {
                    "status": "error",
                    "message": "La requête à l'API news n'a pas fonctionné. Voici le message renvoyé par l'API : {}".format(
                        content["message"]
                    ),
                }
            ),
            500,
        )

    keywords, articles = extract_keywords(content["articles"])

    return jsonify(
        {
            "status": "ok",
            "data": {
                "keywords": keywords[
                    :100
                ],  # On retourne uniquement les 100 premiers mots
                "articles": articles,
            },
        }
    )


if __name__ == "__main__":
    app.run(debug=True)  # TODO supprimer le mode debug
