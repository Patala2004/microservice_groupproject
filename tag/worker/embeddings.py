import os
import requests

EMBEDDINGS_URL = f"{os.environ['EMBEDDINGS_URL']}/embed"


def embed(sentences):
    data = {"sentences": sentences}
    try:
        response = requests.post(EMBEDDINGS_URL, json=data, timeout=300)
        response.raise_for_status()
        embeddings = response.json()["embeddings"]
        return embeddings
    except requests.RequestException as e:
        print("Error en la petición:", e)
        return None
