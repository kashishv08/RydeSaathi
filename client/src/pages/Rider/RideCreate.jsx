import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DriverArriving from '../../components/rider/DriverArriving';
import PaymentRider from '../../components/rider/PaymentRider';
import FindingDriver from '../../components/rider/FindingDriver';
import StaticRouteMap from '../../components/shared/StaticRouteMap';
import ActiveTrackingMap from '../../components/shared/ActiveTrackingMap';
import Navbar from "../../components/shared/layout/Navbar";
import { useFetchRoutePolyline, useRideCreate, useRideDetails } from '../../hooks/rider';
import { RIDE_STATUS } from '../../constants';
import { useActiveRideWebSocket } from '../../hooks/useActiveRideWebSocket';
import { getConnectingTime } from '../../utils/vehicleHelpers';
import { useTransitionRide } from '../../hooks/driver';
import { toast } from '@heroui/react';

export default function RideCreate() {
    const location = useLocation();
    const navigate = useNavigate();

    const [payload] = useState(location.state?.ridePayload);

    useEffect(() => {
        if (location.state?.ridePayload) {
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate]);

    const [driverloc, setDriverloc] = useState(null);
    const [initialDriverLoc, setInitialDriverLoc] = useState(null);
    const [rideState, setRideState] = useState('finding');
    const [findingText, setFindingText] = useState("Finding drivers nearby");
    const [activeRideId, setActiveRideId] = useState(null);

    const { mutateAsync: rideCreateAsync } = useRideCreate();
    const { data: rideDetail, refetch: refetchRideDetails } = useRideDetails();
    const { mutate: transitionRide } = useTransitionRide();

    const ride = rideDetail?.data;

    const pickupCoords = ride ? {
        lat: parseFloat(ride.pickup_lat),
        lon: parseFloat(ride.pickup_lng),
        name: ride.pickup_address
    } : null;

    const dropCoords = ride ? {
        lat: parseFloat(ride.drop_lat),
        lon: parseFloat(ride.drop_lng),
        name: ride.drop_address
    } : null;

    const routeData = ride?.route_geometry ? {
        geometry: ride.route_geometry,
        durationSeconds: ride.route_duration_min * 60,
        distanceMeters: ride.route_distance_km * 1000
    } : null;

    const hasCreatedRide = useRef(false);
    
    // Dynamically fetch the route from the driver's current location to their destination
    const driverDest = rideState === 'found' ? pickupCoords : dropCoords;
    const { data: driverRouteData } = useFetchRoutePolyline({
        pickup: driverloc ?? null,
        drop: driverDest ?? null,
        enabled: (rideState === 'found' || rideState === 'in_progress') && !!driverloc && !!driverDest
    });

    useActiveRideWebSocket(activeRideId, setRideState, setDriverloc, setInitialDriverLoc, refetchRideDetails);

    useEffect(() => {
        if (!payload || hasCreatedRide.current) return;
        hasCreatedRide.current = true;

        const createRide = async () => {
            try {
                const res = await rideCreateAsync(payload);
                setActiveRideId(res.data.id);
            } catch (err) {
                console.error('[RideCreate] failed:', err);
                navigate('/ride/search');
            }
        };
        createRide();
    }, [payload, navigate, rideCreateAsync]);

    useEffect(() => {
        if (!payload && rideDetail && !rideDetail.data && !activeRideId) {
            navigate('/ride/search', { replace: true });
        }
    }, [payload, rideDetail, activeRideId, navigate]);

    useEffect(() => {
        if (!ride) return;

        setActiveRideId(ride.id);
        if (ride.status === RIDE_STATUS.ACCEPTED || ride.status === RIDE_STATUS.ARRIVED) {
            setRideState('found');
        } else if (ride.status === RIDE_STATUS.IN_PROGRESS) {
            setRideState('in_progress');
        } else if (ride.status === RIDE_STATUS.COMPLETED) {
            setRideState('completed');
        }

        if (ride.driver_location) {
            const loc = { lat: ride.driver_location.lat, lon: ride.driver_location.lng };
            setDriverloc(loc);
            setInitialDriverLoc(prev => prev || loc);
        }
    }, [ride]);

    useEffect(() => {
        if (rideState !== 'finding') return;

        const messages = [
            "Finding drivers nearby",
            () => `Connecting you with a driver by ${getConnectingTime()}`,
            "We'll update you as soon as we can"
        ];

        let currentIndex = 0;
        const cycleTimer = setInterval(() => {
            currentIndex = (currentIndex + 1) % messages.length;
            const msg = messages[currentIndex];
            setFindingText(typeof msg === 'function' ? msg() : msg);
        }, 4000);

        const timeoutTimer = setTimeout(() => setRideState('timeout'), 60000);

        return () => {
            clearInterval(cycleTimer);
            clearTimeout(timeoutTimer);
        };
    }, [rideState]);

    useEffect(() => {
        if (rideState === 'paid') {
            toast.success("Payment Successful! Ride completed.");
            navigate('/ride/search');
        }
    }, [rideState, navigate]);

    const handleCancel = (reason = "other") => {
        const payload = {
            ride_id: activeRideId,
            status: RIDE_STATUS.CANCELLED,
            cancel_reason: reason
        }
        transitionRide(payload)
        navigate('/ride/search')
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
            <Navbar />
            <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-0">

                {/* Left Sidebar */}
                <div className="w-full md:w-[450px] shrink-0 z-10 flex flex-col h-full bg-transparent p-4 md:p-6 min-h-0 relative pointer-events-none">
                    <div className="pointer-events-auto h-full flex flex-col">

                        {rideState === 'finding' && (
                            <FindingDriver
                                pickup={pickupCoords?.name}
                                drop={dropCoords?.name}
                                fare={ride?.amount ?? 0.0}
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
                                onCancel={handleCancel}
                                isInProgress={false}
                                pickupEtaMins={driverRouteData ? Math.ceil(driverRouteData.durationSeconds / 60) : null}
                            />
                        )}

                        {rideState === 'in_progress' && (
                            <DriverArriving onCancel={handleCancel} isInProgress={true} />
                        )}

                        {rideState === 'completed' && (
                            <PaymentRider />
                        )}
                    </div>
                </div>

                {/* Right Map */}
                <div className="flex-1 relative min-h-0 overflow-hidden md:p-6 md:pl-0 pt-0 absolute inset-0 md:static">
                    <div className="w-full h-full relative md:rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.1)]">
                        {(rideState === 'finding' || rideState === 'timeout') && (
                            <StaticRouteMap
                                pickup={pickupCoords}
                                drop={dropCoords}
                                routeData={routeData}
                            />
                        )}

                        {rideState === 'found' && (
                            <ActiveTrackingMap
                                startPoint={initialDriverLoc}
                                endPoint={pickupCoords}
                                routeData={driverRouteData}
                                driverLocation={driverloc}
                                role="RIDER"
                            />
                        )}

                        {(rideState === 'in_progress' || rideState === 'completed' || rideState === 'paid') && (
                            <ActiveTrackingMap
                                startPoint={pickupCoords}
                                endPoint={dropCoords}
                                routeData={driverRouteData}
                                driverLocation={driverloc}
                                role="RIDER"
                                showEtaBadge={true}
                                isCompleted={rideState === 'completed' || rideState === 'paid'}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
