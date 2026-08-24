import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export function useActiveRideWebSocket(activeRideId, setRideState, setDriverloc, setInitialDriverLoc, refetchRideDetails) {
    const wsRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!activeRideId) return;

        const socket = new WebSocket(`ws://localhost:8000/ws/ride/${activeRideId}/`);
        wsRef.current = socket;

        socket.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            console.log("[Rider WebSocket Message]: ", msg);

            if (msg.type === "status_update") {
                if (msg.ride_status === "ACCEPTED") {
                    setRideState("found");
                    if (refetchRideDetails) {
                        refetchRideDetails();
                    }
                } else if (msg.ride_status === "NO_DRIVERS") {
                    navigate('/ride/search');
                } else if (msg.ride_status === "IN_PROGRESS") {
                    setRideState("in_progress");
                } else if (msg.ride_status === "COMPLETED") {
                    setRideState("completed");
                } else if (msg.ride_status === "PAYMENT_SUCCESSFULL") {
                    setRideState("paid");
                }
            }
            if (msg.type === "location_update") {
                const loc = { lat: msg.lat, lon: msg.lng };
                setDriverloc(loc);
                setInitialDriverLoc(prev => prev || loc);
            }
        };

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
        };
    }, [activeRideId, navigate, setRideState, setDriverloc, setInitialDriverLoc, refetchRideDetails]);
}
