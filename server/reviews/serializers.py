from rest_framework import serializers
from .models import Review
from rides.serializers import RideSerializer

class ReviewCreateSerializer(serializers.Serializer):
    stars = serializers.IntegerField(min_value=1, max_value=5)
    comment = serializers.CharField(required=False, allow_blank=True, default="")
    ride_id = serializers.UUIDField()

class ReviewSerializer(serializers.ModelSerializer):
    ride = RideSerializer(read_only=True)
    given_by = serializers.ReadOnlyField()
    given_to = serializers.ReadOnlyField()

    class Meta:
        model = Review
        fields = ["ride", "given_by", "given_to", "comment", "stars"]
