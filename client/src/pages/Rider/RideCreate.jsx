import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from "../../components/shared/layout/Navbar";
import FindingDriver from '../../components/rider/FindingDriver';
import DriverArriving from '../../components/rider/DriverArriving';
import RideMap from '../../components/rider/RideMap';
import { getConnectingTime } from '../../utils/vehicleHelpers';
import { useRideCreate } from '../../hooks/rider';

export default function RideCreate() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const payload = state?.ridePayload;

    const [pickupCoords, setPickupCoords] = useState(payload ? { lat: payload.pickup_lat, lon: payload.pickup_lng, name: payload.pickup_address } : null);
    const [dropCoords, setDropCoords] = useState(payload ? { lat: payload.drop_lat, lon: payload.drop_lng, name: payload.drop_address } : null);

    const [rideState, setRideState] = useState('finding');
    const [findingText, setFindingText] = useState("Finding drivers nearby");

    const { mutate: rideCreate } = useRideCreate();
    const hasCreatedRide = useRef(false);

    useEffect(() => {
        if (!payload || hasCreatedRide.current) return;
        hasCreatedRide.current = true;

        rideCreate(payload, {
            onSuccess: (res) => {
                console.log('[RideCreate] ride created:', res.data.id);
                // TODO: open WebSocket to ws://localhost:8000/ws/ride/<rider_id>/
                // listen for status_update → ACCEPTED → setRideState('found')
                // listen for NO_DRIVERS  → navigate back to search
            },
            onError: (err) => {
                console.error('[RideCreate] failed:', err);
                navigate('/ride/search');
            }
        });
    }, []);

    console.log(payload);
    // Time bound finding logic exactly as requested
    useEffect(() => {
        if (rideState !== 'finding') return;

        const messages = [
            "Finding drivers nearby",
            () => {
                return `Connecting you with a driver by ${getConnectingTime()}`;
            },
            "We'll update you as soon as we can"
        ];

        let currentIndex = 0;

        const cycleTimer = setInterval(() => {
            currentIndex = (currentIndex + 1) % messages.length;
            const nextMsg = messages[currentIndex];
            setFindingText(typeof nextMsg === 'function' ? nextMsg() : nextMsg);
        }, 4000); // Rotate every 4 seconds

        // Timeout (10 seconds, but set to 60s as requested)
        const timeoutTimer = setTimeout(() => {
            setRideState('timeout');
        }, 60000);

        return () => {
            clearInterval(cycleTimer);
            clearTimeout(timeoutTimer);
        };
    }, [rideState]);

    const handleCancel = () => {
        navigate('/ride/search');
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
            <Navbar />
            <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-0">
                {/* Left Sidebar - Dynamic state */}
                <div className="w-full md:w-[450px] shrink-0 z-10 flex flex-col h-full bg-transparent p-4 md:p-6 min-h-0 relative pointer-events-none">

                    <div className="pointer-events-auto h-full flex flex-col">
                        {rideState === 'finding' && (
                            <FindingDriver
                                pickup={payload?.pickup_address}
                                drop={payload?.drop_address}
                                fare={payload?.amount || 0.0}
                                statusText="Ride requested"
                                subText={findingText}
                                onCancel={handleCancel}
                            />
                        )}

                        {rideState === 'timeout' && (
                            <div className="border border-gray-200 rounded-xl p-6 shadow-sm bg-white flex flex-col text-center">
                                <h2 className="text-2xl font-bold text-black mb-2">Its busier than usual</h2>
                                <p className="text-gray-600 text-base mb-8">Thanks for your patience</p>

                                <button
                                    onClick={handleCancel}
                                    className="bg-gray-100 hover:bg-gray-200 text-black font-medium text-lg py-3 rounded-xl transition-colors"
                                >
                                    Go back to ride search
                                </button>
                            </div>
                        )}

                        {rideState === 'found' && (
                            <DriverArriving
                                pickup={pickupCoords}
                                drop={dropCoords}
                                fare={payload?.amount || 0.0}
                                onCancel={handleCancel}
                            />
                        )}

                        {/* DEBUG BUTTONS - Remove these later */}
                        <div className="mt-auto pt-4 flex gap-2 overflow-x-auto text-xs">
                            <button onClick={() => setRideState('finding')} className="bg-gray-200 px-2 py-1 rounded">Test: Finding</button>
                            <button onClick={() => setRideState('timeout')} className="bg-gray-200 px-2 py-1 rounded">Test: Timeout</button>
                            <button onClick={() => setRideState('found')} className="bg-gray-200 px-2 py-1 rounded">Test: Found</button>
                        </div>
                    </div>
                </div>

                {/* Right Map - Fixed */}
                <div className="flex-1 relative min-h-0 overflow-hidden md:p-6 md:pl-0 pt-0 absolute inset-0 md:static">
                    <div className="w-full h-full relative md:rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.1)]">
                        <RideMap pickup={pickupCoords} drop={dropCoords} />
                    </div>
                </div>
            </div>
        </div>
    );
}
