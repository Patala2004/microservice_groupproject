import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
import datetime
from .models import User

def requests_session_with_retries():
    retry = Retry(
        total=5,
        connect=5,
        read=5,
        backoff_factor=0.3,  # exponential backoff
        status_forcelist=(502, 503, 504),
        allowed_methods=("POST",),
        raise_on_status=False,
    )

    adapter = HTTPAdapter(max_retries=retry)

    session = requests.Session()
    session.mount("http://", adapter)
    session.mount("https://", adapter)
    return session


session = requests_session_with_retries()

def register_user_in_upref(user : User, tags : list[int]):
    response = session.post(
        "http://host.docker.internal:8086/upref/register",
        json={
            "userId": user.id,
            "timestamp": datetime.datetime.now().isoformat(),
            "tags": tags
        },
        timeout=(2,5),
    )
    response.raise_for_status()
    return response
