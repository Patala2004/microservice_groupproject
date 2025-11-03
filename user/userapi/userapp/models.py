from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    campus : str = models.CharField(null=True, default="", unique=False, max_length=50, blank=True)
    wechat_id : str = models.CharField(null=True, default="", unique=False, max_length=50, blank=True)
    pass
