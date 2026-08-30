import { useEffect, useState } from 'react';
import LocationSender from '../utils/currentLocationHelper';
import { useDriverPing } from './driver';
import { useDriverWebSocket } from '../contexts/DriverWebSocketContext';

export function useDriverLocationPing(enabled = true) {
    // const { mutate: driverLoc } = useDriverPing();
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
                    // driverLoc(data);
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
