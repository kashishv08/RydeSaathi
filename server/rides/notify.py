import logging
logger = logging.getLogger(__name__)
from channels.layers import get_channel_layer
from .models import Ride
from asgiref.sync import async_to_sync

def notify_driver_of_offer(driver_id, ride_id, ride):
        logger.warning(f"WEBSOCKET=====================Sending Ride Offer {ride_id} to Driver {driver_id}")
        channel_layer = get_channel_layer()
        room_name = f"driver_{driver_id}"

        try:
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
        except Exception as e:
            logger.error(f"[notify_driver_of_offer] WebSocket send failed: {e}")

def notify_driver_offer_cancelled(driver_id, ride_id, ride):
        logger.warning(f"WEBSOCKET=====================Cancelling Ride Offer {ride_id} for Driver {driver_id}")
        channel_layer = get_channel_layer()
        room_name = f"driver_{driver_id}"

        try:
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
        except Exception as e:
            logger.error(f"[notify_driver_offer_cancelled] WebSocket send failed: {e}")

def notify_rider_of_status(ride_id, new_status):
    rider_id = Ride.objects.get(pk=ride_id).rider.id
    group_name = f"rider_{rider_id}"
    channel_layer = get_channel_layer()
    try:
        async_to_sync(channel_layer.group_send)(
            group_name, 
            {
                "type": "sent_ride_status",
                "ride_id": str(ride_id),
                "ride_status": new_status
            }
        )
    except Exception as e:
        logger.error(f"[notify_rider_of_status] WebSocket send failed: {e}")

def notify_rider_of_driver_loc(lat, lng, ride):
    group_name = f"rider_{ride.rider.id}"
    channel_layer = get_channel_layer()
    try:
        async_to_sync(channel_layer.group_send)(
            group_name, 
            {
                "type": "driver_location_update",
                "ride_id": str(ride.id),
                "lat":lat,
                "lng":lng
            }
        )
    except Exception as e:
        logger.error(f"[notify_rider_of_driver_loc] WebSocket send failed: {e}")