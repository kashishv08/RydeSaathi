import { useEffect } from 'react';
import LocationSender from '../utils/currentLocationHelper';
import { useDriverPing } from './driver';

export function useDriverLocationPing(enabled = true) {
    const { mutate: driverLoc } = useDriverPing();

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
                    driverLoc(data);
                }
            }, 5000); // 5 seconds
        }
        
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [enabled, driverLoc]);
}
