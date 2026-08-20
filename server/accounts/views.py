from .serializers import SendOTPSerializer,VerifyOTPSerializer
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status as http_status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenBlacklistSerializer
from .serializers import RegisterSerializer
from .models import User
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .utils import generate_otp, send_otp_email, issue_tokens
from django.utils import timezone
from datetime import timedelta

# Create your views here.
class LogoutView(APIView):
    authentication_classes = []
    permission_classes = []
    def post(self, request):
        refresh = request.COOKIES.get("refresh_token")
        # if not refresh:
        #     return Response({"error": "Refresh Token is missing!"}, status=http_status.HTTP_401_UNAUTHORIZED)
        serializer = TokenBlacklistSerializer(data={"refresh":refresh})
        try:
            serializer.is_valid(raise_exception=True)
        except Exception:
            return Response(
                {"message": "Already logged out!"},
                status=http_status.HTTP_400_BAD_REQUEST
            )
        response = Response({"message": "Successfully logged out"}, status=http_status.HTTP_200_OK)
        response.delete_cookie("refresh_token")
        return response



class RefreshTokenView(TokenRefreshView):
    def post(self, request):
        refresh = request.COOKIES.get("refresh_token")
        if not refresh:
            return Response({"error": "Refresh Token is missing!"}, status=http_status.HTTP_401_UNAUTHORIZED)

        request.data["refresh"] = refresh
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=http_status.HTTP_200_OK)

class SendOTPView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = SendOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        requested_role = serializer.validated_data.get("role")

        user_exists = User.objects.filter(email=email).exists()
        purpose = serializer.validated_data.get("purpose")
        

        if purpose == "login":
            if not user_exists:
                return Response(
                    {"error": "User does not exist with this email. Please Register!"},
                    status=http_status.HTTP_404_NOT_FOUND,
                )
            user = User.objects.get(email=email)
            
        elif purpose and purpose.lower() == "register":
            if user_exists:
                user = User.objects.get(email=email)
                return Response(
                    {"error": f"An account with this email already exists as a {user.role.title()}."},
                    status=http_status.HTTP_400_BAD_REQUEST,
                )
            if not requested_role:
                return Response(
                    {"error": "Role is required for new accounts."},
                    status=http_status.HTTP_400_BAD_REQUEST,
                )
            user = User.objects.create(
                email=email,
                role=requested_role,
                is_active=False,
            )
        else:
            return Response({"error": "Invalid purpose parameter."}, status=http_status.HTTP_400_BAD_REQUEST)
        
        otp = generate_otp()
        user.email_otp = otp
        user.email_otp_created_at = timezone.now()
        user.save(update_fields=["email_otp", "email_otp_created_at"])
        try:
            send_otp_email(email, otp, purpose)
        except Exception as e:
            return Response(
                {"error": f"Failed to send OTP email: {str(e)}"},
                status=http_status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        return Response(
            {
                "message": f"OTP sent to {email}",
                "purpose": purpose,  
            },
            status=http_status.HTTP_200_OK,
        )

class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email    = serializer.validated_data["email"]
        otp_input = serializer.validated_data["otp"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"error": "No account found for this email."},
                status=http_status.HTTP_404_NOT_FOUND,
            )

        if not user.email_otp or not user.email_otp_created_at:
            return Response(
                {"error": "No OTP was requested. Please request one first."},
                status=http_status.HTTP_400_BAD_REQUEST,
            )

        otp_age = timezone.now() - user.email_otp_created_at
        if otp_age > timedelta(minutes=10):
            return Response(
                {"error": "OTP has expired. Please request a new one."},
                status=http_status.HTTP_400_BAD_REQUEST,
            )

        if user.email_otp != otp_input:
            return Response(
                {"error": "Invalid OTP. Please try again."},
                status=http_status.HTTP_400_BAD_REQUEST,
            )

        user.is_active = True
        user.email_verified = True
        user.email_otp = None   
        user.email_otp_created_at = None
        user.save(update_fields=["is_active", "email_verified", "email_otp", "email_otp_created_at"])
        return issue_tokens(user)

class userProfileView(APIView):
    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "email": user.email,
            "role": user.role,
            "rating": user.rating_avg,
        }, status=http_status.HTTP_200_OK)


# class RegisterView(CreateAPIView):
#     queryset = User.objects.all()
#     serializer_class = RegisterSerializer
#     permission_classes = [AllowAny]

#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         user = serializer.save()

#         refresh = RefreshToken.for_user(user)
#         response = Response({
#             "access": str(refresh.access_token),
#             "role": user.role
#         },status=http_status.HTTP_201_CREATED)
#         response.set_cookie(
#             key="refresh_token",
#             value=refresh,
#             httponly=True,
#             secure=False,
#             samesite="Lax",
#             path="/"
#         )
#         response.data.pop("refresh", None)
#         return response
# class LoginView(TokenObtainPairView):
#     def post(self, request, *args, **kwargs):
#         response = super().post(request, *args, **kwargs)
#         refresh = response.data.get("refresh")
#         response.set_cookie(
#             key="refresh_token",
#             value=refresh,
#             httponly=True,
#             secure=False,
#             samesite="Lax",
#             path="/"
#         )
#         response.data.pop("refresh", None)
#         return response



