from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User 


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ["email", "username", "password", "role"]

    def create(self, validated_data):  
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password) 
        user.save()
        return user
