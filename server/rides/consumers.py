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

    async def receive(self, text_data):
        pass
    
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
