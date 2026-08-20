import random
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status as http_status
from django.core.mail import send_mail
from django.conf import settings

def generate_otp():
    return str(random.randint(100000, 999999))

def issue_tokens(user):
    refresh = RefreshToken.for_user(user)
    response = Response(
        {
            "access":str(refresh.access_token),
            "role":user.role,
            "email":user.email,
            "email_verified":user.email_verified,
        },
        status=http_status.HTTP_200_OK,
    )
    response.set_cookie(
        key="refresh_token",
        value=str(refresh),
        httponly=True,
        secure=False, 
        samesite="Lax",
        path="/",
    )
    return response

def send_otp_email(email, otp, purpose):
    try:
        if purpose == "register":
            subject = "Welcome to RydeSaathi — Verify your email"
            body = (
                f"Hey there!\n\n"
                f"Your RydeSaathi registration OTP is:\n\n"
                f"  {otp}\n\n"
                f"This code expires in 10 minutes.\n"
                f"Do not share it with anyone.\n\n"
                f"— RydeSaathi Team"
            )
        else:
            subject = "Your RydeSaathi login OTP"
            body = (
                f"Your RydeSaathi login OTP is:\n\n"
                f"  {otp}\n\n"
                f"This code expires in 10 minutes.\n"
                f"Do not share it with anyone.\n\n"
                f"— RydeSaathi Team"
            )
        send_mail(
            subject=subject,
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )
    except Exception as error:
        print(f"Failed to send email: {error}")
        raise error