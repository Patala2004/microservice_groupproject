import os
import requests
from tagexceptions import NonRequeueableError

URL = f"""{os.environ['POST_SERVICE_URL']}/post"""


def getTitleContent(post_id):
    try:
        response = requests.get(URL+f"/{post_id}", timeout=60)
        response.raise_for_status()
    except requests.exceptions.HTTPError as e:
        status = e.response.status_code

        if status == 404:
            raise NonRequeueableError(
                f"Post {post_id} does not exist"
            ) from e

        if 400 <= status < 500:
            raise NonRequeueableError(
                f"Client error {status} for post {post_id}"
            ) from e

    try:
        payload = response.json()
        title = payload["title"]
        content = payload["content"]
    except Exception as e:
        raise NonRequeueableError(
            f"Malformed post payload for {post_id}"
        ) from e

    return title, content
