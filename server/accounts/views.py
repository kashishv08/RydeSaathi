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


# Create your views here.
class RegisterView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)
        response = Response({
            "access": str(refresh.access_token),
            "role": user.role
        },status=http_status.HTTP_201_CREATED)
        response.set_cookie(
            key="refresh_token",
            value=refresh,
            httponly=True,
            secure=False,
            samesite="Lax",
            path="/"
        )
        response.data.pop("refresh", None)
        return response


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


class LoginView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        refresh = response.data.get("refresh")
        response.set_cookie(
            key="refresh_token",
            value=refresh,
            httponly=True,
            secure=False,
            samesite="Lax",
            path="/"
        )
        response.data.pop("refresh", None)
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