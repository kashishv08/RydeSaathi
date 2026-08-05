from rest_framework.permissions import BasePermission
from django.contrib.auth import get_user_model

User = get_user_model()

class IsRider(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == User.Role.RIDER

class IsDriver(BasePermission):
    def has_permission(self, request, view): 
        return request.user.role == User.Role.DRIVER
