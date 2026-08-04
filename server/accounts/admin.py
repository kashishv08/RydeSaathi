from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

# Register your models here.

class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ("Uber Lite Fields", {"fields": ("role", "rating_avg")}),
    )

admin.site.register(User, CustomUserAdmin)

