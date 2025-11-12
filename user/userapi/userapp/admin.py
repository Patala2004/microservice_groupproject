from django.contrib import admin
from .models import User, Campus
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import UserChangeForm, UserCreationForm

# -------------------
# Forms for the admin
# -------------------

class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ("username", "campus", "name", "preferedLanguage", "email")

class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = User
        fields = ("username", "campus", "name", "preferedLanguage", "email", "is_active", "is_staff", "is_superuser")

# -------------------
# Admin class
# -------------------

class UserAdmin(BaseUserAdmin):
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm

    list_display = ("username", "name", "campus", "is_staff", "is_superuser")
    list_filter = ("is_staff", "is_superuser", "preferedLanguage", "campus")

    fieldsets = (
        (None, {"fields": ("username", "password")}),
        ("Personal info", {"fields": ("name", "campus", "preferedLanguage", "email", "weixinId", "phone_number")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("username", "campus", "name", "preferedLanguage", "password1", "password2", "is_staff", "is_superuser"),
        }),
    )

    search_fields = ("username", "name", "email")
    ordering = ("username",)
    filter_horizontal = ("groups", "user_permissions")

# -------------------
# Register models
# -------------------

admin.site.register(User, UserAdmin)
admin.site.register(Campus)