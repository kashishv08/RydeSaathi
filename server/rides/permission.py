from rest_framework.permissions import BasePermission
from django.contrib.auth import get_user_model

User = get_user_model()

class IsRider(BasePermission):
    def has_permission(self, request, view):
        #  AttributeError → 500
        return bool(
            request.user
            and request.user.is_authenticated
            and hasattr(request.user, 'role')
            and request.user.role == User.Role.RIDER
        )

class IsDriver(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == User.Role.DRIVER
        )
