from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models

class Campus(models.Model):
    en_name : str = models.CharField(max_length=200, unique=True)
    cn_name : str = models.CharField(max_length=200, unique=True)
    
    class Meta:
        verbose_name = "Campus"
        verbose_name_plural = "Campuses" # Puerly for aesthetic purposes on /admin/

    def __str__(self):
        return self.en_name

class UserManager(BaseUserManager):
    def create_user(self, username, password=None, **extra_fields):
        if not username:
            raise ValueError("Users must have a username")
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(username, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    
    LANGUAGE_CHOICES = [
        ("en", "English"),
        ("cn", "Chinese"),
    ]
    
    username : str = models.CharField(max_length=50, unique=True)
    
    name : str = models.CharField(max_length=50, blank=True, default="")
    
    campus : Campus = models.ForeignKey(
        Campus,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="users"
    )
    
    preferedLanguage = models.CharField(
        max_length=2,
        choices=LANGUAGE_CHOICES,
        default="en",
    )
    
    email : str = models.EmailField(max_length=100, blank=True, default="")
    weixinId : str = models.CharField(max_length=50, blank=True, default="")
    phone_number : str = models.CharField(max_length=20, blank=True, default="")
    student_id : str = models.CharField(max_length=20, blank=True, default="")
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["campus", "name", "preferedLanguage"]
    
