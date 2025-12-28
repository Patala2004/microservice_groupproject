import os
import requests

URL = f"""{os.environ['POST_SERVICE_URL']}/post"""


def getTitleContent(post_id):
    response = requests.get(URL+f"/{post_id}", timeout=60)
    response.raise_for_status()
    title = response.json()["title"]
    content = response.json()["content"]
    return title, content
