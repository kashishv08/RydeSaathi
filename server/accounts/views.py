from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenBlacklistSerializer
from .serializers import RegisterSerializer
from .models import User

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
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "role": user.role
        }, status=status.HTTP_201_CREATED)


class LogoutView(APIView):
    def post(self, request):
        serializer = TokenBlacklistSerializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except Exception:
            return Response(
                {"message": "Already logged out or token is invalid"},
                status=status.HTTP_400_BAD_REQUEST
            )
        return Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)
