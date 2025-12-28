import os
import requests

TRANSLATION_URL = f"{os.environ['TRANSLATION_URL']}/translate"


def translate(texts, language):
    data = {
        "texts": texts,
        "language": language
    }
    try:
        response = requests.post(TRANSLATION_URL, json=data, timeout=300)
        response.raise_for_status()
        return response.json()["translation"]
    except requests.RequestException as e:
        print("Error en la petición:", e)
        return None
