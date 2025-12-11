import os
import requests

URL = os.environ['POST_SERVICE_URL']

def getTitleContent(post_id):
    response = requests.get(URL+f"/{post_id}", timeout=60)
    response.raise_for_status()
    title = response.title
    content = response.content
    return title, content