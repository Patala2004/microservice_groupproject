from .external import register_user_in_upref
from .models import User
from django.db import transaction

@transaction.atomic
def create_user_and_register_in_upref(user : User, tags: list[int]):
    user.save()
    register_user_in_upref(user, tags)
    return user
