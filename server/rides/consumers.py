from channels.db import database_sync_to_async
from locations.geo import update_driver_location
from drivers.models import DriverProfile
from locations.geo import set_cached_city
from rides.services import get_location_from_coord
from locations.geo import get_cached_city
from rides.notify import notify_rider_of_driver_loc
from channels.generic.websocket import  AsyncWebsocketConsumer
import json
from .models import Ride

class DriverConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # self.user = self.scope['user']

        # if not self.user.is_authenticated:
        #     await self.close()

        self.driver_id = self.scope['url_route']['kwargs']['driver_id']
        self.room_name = f"driver_{self.driver_id}"
        await self.channel_layer.group_add(self.room_name, self.channel_name)
        await self.accept()

    @database_sync_to_async
    def process_location_update(self, lat, lng):
        try:
            profile = DriverProfile.objects.get(user_id=self.driver_id)
        except DriverProfile.DoesNotExist:
            return False

        city = get_cached_city(profile.user_id) 
        if not city:
            location_info = get_location_from_coord(lat, lng)
            city = location_info.get("city")
            print(city)
            if city:
                set_cached_city(city, profile.user_id)

                if profile.current_city != city:
                    profile.current_city = city
                    profile.save(update_fields=["current_city"])

        if city:
            update_driver_location(lat, lng, profile.user.id, city)

        active_ride = Ride.objects.filter(
            driver=profile.user,
            status__in=[Ride.Status.ACCEPTED, Ride.Status.ARRIVED, Ride.Status.IN_PROGRESS]
        ).order_by('-requested_at').first()

        if active_ride:
            notify_rider_of_driver_loc(lat, lng, active_ride)
            
        return True

    async def location_update(self, lat, lng):
        success = await self.process_location_update(lat, lng)
        if not success:
            await self.send(text_data=json.dumps({
                "type": "location_update",
                "message": "Profile does not exist!"
            }))

    async def receive(self, text_data):
        data = json.loads(text_data)
        print(data)
        event = data.get("event")
        lng = data.get("lng")
        lat = data.get("lat")

        if event == "location_update":
            if lng is not None and lat is not None:
                await self.location_update(lat, lng)
            
    
    async def ride_offer(self, event):
        await self.send(text_data=json.dumps({
            "type": "ride_offer",
            "ride_id": event["ride_id"],
            "pickup_address": event["pickup_address"],
            "drop_address": event["drop_address"],
            "route_distance_km": event["route_distance_km"],
            "route_duration_min": event["route_duration_min"],
            "timeout": event["timeout"],
            "amount": event.get("amount", 0.0)
        }))

    async def cancel_ride_offer(self, event):
        await self.send(text_data=json.dumps({
            "type": "cancel_ride_offer",
            "ride_id": event["ride_id"],
            "pickup_address": event["pickup_address"],
            "drop_address": event["drop_address"],
            "route_distance_km": event["route_distance_km"],
            "route_duration_min": event["route_duration_min"],
            "timeout": event["timeout"],
            "amount": event.get("amount", 0.0)
        }))

    async def sent_ride_status(self, event):
        await self.send(text_data=json.dumps({
            "type": "status_update",
            "ride_id": event["ride_id"],
            "ride_status": event["ride_status"]
        }))


    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_name, self.channel_name)

class RideConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # self.user = self.scope['user']

        # if not self.user.is_authenticated:
        #     await self.close()
        ride_id = self.scope["url_route"]["kwargs"]["ride_id"]
        self.group_name = f"ride_{ride_id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def sent_ride_status(self, event):
        await self.send(text_data=json.dumps({
            "type": "status_update",
            "ride_id": event["ride_id"],
            "ride_status": event["ride_status"]
        }))

    async def driver_location_update(self, event):
        await self.send(text_data=json.dumps({
            "type": "location_update",
            "lat": event["lat"],
            "lng": event["lng"],
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)
