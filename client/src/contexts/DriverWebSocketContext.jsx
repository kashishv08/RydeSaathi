import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useDriverProfile } from '../hooks/driver';

const DriverWebSocketContext = createContext(null);

export const useDriverWebSocket = () => {
    return useContext(DriverWebSocketContext);
};

export const DriverWebSocketProvider = ({ children }) => {
    const { data: profile } = useDriverProfile();
    const driverId = profile?.data?.user || profile?.data?.id || profile?.data?.driver_id;
    console.log("Driver profile data:", profile?.data);
    const [lastMessage, setLastMessage] = useState(null);
    const socketRef = useRef(null);

    useEffect(() => {
        if (!driverId) return;

        console.log(`Connecting Global Driver WebSocket for ${driverId}`);
        const socket = new WebSocket(`ws://localhost:8000/ws/driver/${driverId}/`);
        socketRef.current = socket;

        socket.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            console.log("[Global Driver WS]", msg);
            setLastMessage(msg);
        };

        socket.onclose = () => {
            console.log("Global Driver WebSocket Disconnected");
            socketRef.current = null;
        };

        return () => {
            socket.close();
        };
    }, [driverId]);

    return (
        <DriverWebSocketContext.Provider value={{ socket: socketRef.current, lastMessage, setLastMessage }}>
            {children}
        </DriverWebSocketContext.Provider>
    );
};
