import { useEffect, useState } from 'react';
import { useDriverWebSocket } from '../contexts/DriverWebSocketContext';
import LocationSender from '../utils/currentLocationHelper';

export function useDriverLocationPing(enabled = true) {
    const { socket } = useDriverWebSocket();
    const [driverLocation, setDriverLocation] = useState()

    useEffect(() => {
        let interval;
        if (enabled) {
            interval = setInterval(async () => {
                const location = await LocationSender();
                if (location?.loc) {
                    const data = {
                        "lat": location.loc.lat,
                        "lng": location.loc.lng
                    }
                    console.log(socket)
                    if (socket) {
                        socket.send(JSON.stringify({
                            "event": "location_update",
                            "lng": location.loc.lng,
                            "lat": location.loc.lat
                        }));
                    }
                    setDriverLocation({ "lat": data.lat, "lon": data.lng });
                }
            }, 5000); // 5 seconds
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [enabled]);

    return driverLocation;
}
