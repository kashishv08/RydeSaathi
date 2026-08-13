from rest_framework.views import APIView
from django.shortcuts import render
from rides.models import Ride
from django.db.models import Q
from .models import Review
from accounts.models import User
from rest_framework import status as http_status
from rest_framework.response import Response
from .serializers import ReviewCreateSerializer
from .utils import update_driver_rating
from django.db import IntegrityError
import logging
logger = logging.getLogger(__name__)


# Create your views here.
class ReviewCreateView(APIView):
    def post(self, request):
        serializer = ReviewCreateSerializer(data=request.data)   
        serializer.is_valid(raise_exception=True)

        ride_id = serializer.validated_data.get("ride_id")
        logger.warning("Logged in as:", request.user.email) 
        ride = Ride.objects.filter(Q(rider=request.user) | Q(driver=request.user), status=Ride.Status.COMPLETED, id=ride_id).first()

        if not ride:
            return Response({"error": "Completed ride not found!"}, status=http_status.HTTP_404_NOT_FOUND)
        
        current_is_rider = request.user.role == User.Role.RIDER
        given_to = ride.driver if current_is_rider else ride.rider

        try:
            serializer.validated_data.pop("ride_id")
            review = Review.objects.create(
                ride=ride,
                given_by=request.user,
                given_to=given_to,
                **serializer.validated_data
            )
            if current_is_rider:
                update_driver_rating(ride.driver)
        except IntegrityError:
            return Response({"error": "You have already rated this ride"}, status=http_status.HTTP_400_BAD_REQUEST)

        return Response({
            "message": "Review submitted successfully",
            "stars": review.stars,
            "comment": review.comment,
        }, status=http_status.HTTP_201_CREATED)