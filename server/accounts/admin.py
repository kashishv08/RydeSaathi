from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

# Register your models here.

class CustomUserAdmin(UserAdmin):
    ordering = ("email",)
    list_display = ("email", "role", "email_verified", "is_active")
    search_fields = ("email",)

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal Info", {"fields": ("first_name", "last_name", "phone")}),
        ("RydeSaathi Fields", {"fields": ("role", "rating_avg", "email_otp", "email_verified", "avatar")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Important dates", {"fields": ("last_login", "created_at")}),
    )
    readonly_fields = ("created_at",)

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "role", "password1", "password2"),
        }),
    )

admin.site.register(User, CustomUserAdmin)
