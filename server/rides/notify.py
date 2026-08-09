from .services import get_location_from_coord
import logging
logger = logging.getLogger(__name__)
from channels.layers import get_channel_layer
from .models import Ride
from asgiref.sync import async_to_sync

def notify_driver_of_offer(driver_id, ride_id, ride):
        logger.warning(f"WEBSOCKET=====================Sending Ride Offer {ride_id} to Driver {driver_id}")
        channel_layer = get_channel_layer()
        room_name = f"driver_{driver_id}"

        async_to_sync(channel_layer.group_send)(
            room_name,
            {
                "type": "ride_offer",
                "ride_id": str(ride_id),
                "pickup_address": ride.pickup_address,
                "drop_address": ride.drop_address,
                "route_distance_km": float(ride.route_distance_km),
                "route_duration_min": float(ride.route_duration_min),
                "timeout": 15
            }
        )

def notify_driver_offer_cancelled(driver_id, ride_id, ride):
        logger.warning(f"WEBSOCKET=====================Cancelling Ride Offer {ride_id} for Driver {driver_id}")
        channel_layer = get_channel_layer()
        room_name = f"driver_{driver_id}"

        async_to_sync(channel_layer.group_send)(
            room_name,
            {
                "type": "cancel_ride_offer",
                "ride_id": str(ride_id),
                "pickup_address": ride.pickup_address,
                "drop_address": ride.drop_address,
                "route_distance_km": float(ride.route_distance_km),
                "route_duration_min": float(ride.route_duration_min),
                "timeout": 15
            }
        )
