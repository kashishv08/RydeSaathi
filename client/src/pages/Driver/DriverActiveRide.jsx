import { toast } from '@heroui/react';
import { MessageSquare, Navigation, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ActiveTrackingMap from '../../components/shared/ActiveTrackingMap';
import { RIDE_STATUS } from '../../constants';
import { useDriverWebSocket } from '../../contexts/DriverWebSocketContext';
import { useTransitionRide } from '../../hooks/driver';
import { useFetchRoutePolyline, useRideDetails } from '../../hooks/rider';
import { useDriverLocationPing } from '../../hooks/useDriverLocationPing';
import RideRating from '../../components/shared/RideRating';
import { getDynamicEtaMins } from '../../utils/geoHelpers';

export default function DriverActiveRide() {
    const navigate = useNavigate();

    const driverloc = useDriverLocationPing(true);
    const { mutate: rideTransition } = useTransitionRide();
    const { data: rideDetailResponse } = useRideDetails();

    const [ride, setRide] = useState(rideDetailResponse?.data || null);

    useEffect(() => {
        if (rideDetailResponse?.data) {
            setRide(rideDetailResponse.data);
        }
    }, [rideDetailResponse?.data]);

    const [rideStatus, setRideStatus] = useState(ride?.status || RIDE_STATUS.ACCEPTED);
    const [otpInput, setOtpInput] = useState('');

    const isHeadingToDropoff = rideStatus === "IN_PROGRESS" || rideStatus === "COMPLETED";

    const routeStartPoint = driverloc ? {
        "lat": driverloc.lat,
        "lon": driverloc.lon
    } : null;

    const routeEndPoint = isHeadingToDropoff
        ? (ride?.drop_lat ? { "lat": ride.drop_lat, "lon": ride.drop_lng, "name": ride.drop_address } : null)
        : (ride?.pickup_lat ? { "lat": ride.pickup_lat, "lon": ride.pickup_lng, "name": ride.pickup_address } : null);

    const { data: routeData } = useFetchRoutePolyline({
        pickup: routeStartPoint,
        drop: routeEndPoint,
        enabled: !!(routeStartPoint && routeEndPoint)
    });

    useEffect(() => {
        if (ride?.status) {
            setRideStatus(ride.status);
        }
    }, [ride?.status]);

    const { lastMessage } = useDriverWebSocket();

    useEffect(() => {
        if (!lastMessage) return;

        if (lastMessage.type === "status_update") {
            if (lastMessage.ride_status === "PAYMENT_SUCCESSFULL") {
                toast.success("Payment received successfully!");
                setRideStatus("PAYMENT_SUCCESSFULL");
            } else if (lastMessage.ride_status === "CANCELLED") {
                toast.error("The rider has cancelled the trip.");
                navigate('/driver');
            }
        }
    }, [lastMessage, navigate]);

    const handleAction = async () => {
        if (rideStatus === RIDE_STATUS.ACCEPTED) {
            setRideStatus(RIDE_STATUS.ARRIVED);
            rideTransition({ ride_id: ride.id, status: RIDE_STATUS.ARRIVED });
        } else if (rideStatus === RIDE_STATUS.ARRIVED) {
            if (otpInput !== String(ride?.ride_otp)) {
                toast.warning("Invalid OTP! Please ask the rider for the correct PIN.");
                return;
            }
            setRideStatus(RIDE_STATUS.IN_PROGRESS);
            rideTransition({ ride_id: ride.id, status: RIDE_STATUS.IN_PROGRESS });
        } else if (rideStatus === RIDE_STATUS.IN_PROGRESS) {
            setRideStatus(RIDE_STATUS.COMPLETED);
            rideTransition({ ride_id: ride.id, status: RIDE_STATUS.COMPLETED });
        }
    };

    const getStatusText = () => {
        switch (rideStatus) {
            case RIDE_STATUS.ACCEPTED: return "Heading to Pickup";
            case RIDE_STATUS.ARRIVED: return "Arrived at Pickup";
            case RIDE_STATUS.IN_PROGRESS: return "Heading to Drop-off";
            case RIDE_STATUS.COMPLETED: return "Waiting for Payment...";
            default: return "";
        }
    };

    const getActionText = () => {
        switch (rideStatus) {
            case RIDE_STATUS.ACCEPTED: return "Slide to Arrive";
            case RIDE_STATUS.ARRIVED: return "Start Ride";
            case RIDE_STATUS.IN_PROGRESS: return "Heading to Dropoff";
            default: return "";
        }
    };

    if (!ride) return <div className="h-screen flex items-center justify-center">Loading ride details...</div>;

    return (
        <div className="fixed inset-0 bg-gray-900 font-sans overflow-hidden">
            {/* Map Background */}
            <div className="absolute inset-0 z-0">
                <ActiveTrackingMap 
                    startPoint={routeStartPoint}
                    endPoint={routeEndPoint}
                    routeData={routeData}
                    driverLocation={driverloc}
                    role="DRIVER" 
                    isCompleted={rideStatus === RIDE_STATUS.COMPLETED || rideStatus === 'PAYMENT_SUCCESSFULL'}
                />
                
                {/* Gradient fade at bottom for card visibility */}
                <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/40 to-transparent pointer-events-none z-10"></div>
            </div>

            {/* Top Floating Header */}
            <div className="absolute top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-xl z-20 pointer-events-none flex justify-between items-start">
                <button 
                    onClick={() => navigate('/driver')} 
                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.15)] pointer-events-auto cursor-pointer hover:bg-gray-50 active:scale-95 transition-all"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                        <path d="m15 18-6-6 6-6"/>
                    </svg>
                </button>

                <div className="bg-white/95 backdrop-blur-md px-6 py-3 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] pointer-events-auto flex flex-col items-center border border-gray-100/50">
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-900">{getStatusText()}</span>
                    {rideStatus === RIDE_STATUS.IN_PROGRESS && (
                        <span className="text-green-600 font-bold text-sm mt-0.5">ETA: {driverloc && routeData && routeEndPoint ? getDynamicEtaMins(driverloc, routeEndPoint, routeData.durationSeconds) : '...'} min</span>
                    )}
                </div>

                {/* Empty spacer for flex alignment */}
                <div className="w-12 h-12"></div>
            </div>

            {/* Bottom Floating Card */}
            <div className="absolute bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[400px] bg-white rounded-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] z-20 overflow-hidden pointer-events-auto border border-gray-100">
                <div className="p-5">
                    {/* Rider Info Row */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gray-100 rounded-full overflow-hidden border-2 border-white shadow-sm">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rider" alt="Rider" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900 leading-none mb-1">{ride.rider_email ? ride.rider_email.split('@')[0] : "Rider"}</h3>
                                <div className="flex items-center gap-1.5 bg-gray-100 w-fit px-2 py-0.5 rounded-md">
                                    <span className="text-gray-800 text-xs font-bold">4.9</span>
                                    <span className="text-yellow-500 text-xs">★</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="w-11 h-11 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200 hover:bg-gray-100 transition-colors">
                                <MessageSquare className="w-5 h-5 text-gray-700" />
                            </button>
                            <button className="w-11 h-11 rounded-full bg-black flex items-center justify-center hover:bg-gray-900 transition-colors shadow-md">
                                <Phone className="w-5 h-5 text-white" />
                            </button>
                        </div>
                    </div>

                    <hr className="border-t border-gray-100 mb-5" />

                    {/* Route Info */}
                    <div className="mb-6 flex gap-3">
                        <div className="flex flex-col items-center mt-1 shrink-0">
                            <div className={`w-3 h-3 rounded-full flex items-center justify-center ${rideStatus === RIDE_STATUS.ACCEPTED || rideStatus === RIDE_STATUS.ARRIVED ? 'bg-blue-100 border border-blue-200' : 'bg-green-100 border border-green-200'}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${rideStatus === RIDE_STATUS.ACCEPTED || rideStatus === RIDE_STATUS.ARRIVED ? 'bg-blue-600' : 'bg-green-600'}`}></div>
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                {rideStatus === RIDE_STATUS.ACCEPTED || rideStatus === RIDE_STATUS.ARRIVED ? "Navigating to Pickup" : "Navigating to Drop-off"}
                            </p>
                            <h4 className="text-base font-bold text-gray-900 leading-snug">
                                {rideStatus === RIDE_STATUS.ACCEPTED || rideStatus === RIDE_STATUS.ARRIVED ? ride.pickup_address : ride.drop_address}
                            </h4>
                        </div>
                    </div>

                    {/* OTP Input */}
                    {rideStatus === RIDE_STATUS.ARRIVED && (
                        <div className="mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <p className="text-xs font-bold text-gray-900 mb-2 text-center tracking-wide uppercase">Enter Rider PIN</p>
                            <input
                                type="text"
                                maxLength="4"
                                value={otpInput}
                                onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                                placeholder="0000"
                                className="w-full text-center text-3xl font-black tracking-[0.5em] py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-black bg-white transition-all"
                            />
                        </div>
                    )}

                    {/* Main Action Slider / Button */}
                    {rideStatus !== RIDE_STATUS.COMPLETED && rideStatus !== 'PAYMENT_SUCCESSFULL' ? (
                        <div 
                            onClick={handleAction}
                            className="w-full h-16 bg-black rounded-[1rem] text-lg shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:bg-gray-900 transition-all cursor-pointer relative overflow-hidden group flex items-center p-1.5"
                        >
                            {/* Animated "Slider" Handle */}
                            <div className="h-full w-14 bg-white/20 rounded-[0.75rem] flex items-center justify-center shrink-0 group-hover:w-full transition-all duration-700 ease-in-out relative z-10 backdrop-blur-sm">
                                <div className="flex -space-x-1">
                                    <Navigation className="w-5 h-5 text-white/50 transform rotate-90 animate-pulse" strokeWidth={2.5} />
                                    <Navigation className="w-5 h-5 text-white transform rotate-90 animate-pulse delay-75" strokeWidth={2.5} />
                                </div>
                            </div>
                            
                            {/* Button Text */}
                            <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
                                <span className="text-white font-bold tracking-wide group-hover:opacity-0 transition-opacity duration-300">
                                    {getActionText()}
                                </span>
                            </div>

                            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-10 group-hover:animate-shine pointer-events-none" />
                        </div>
                    ) : (
                        <div className="w-full bg-gray-100 text-gray-500 font-bold py-4 rounded-2xl text-center text-lg">
                            Waiting for Payment...
                        </div>
                    )}
                </div>
            </div>

            {rideStatus === 'PAYMENT_SUCCESSFULL' && (
                <RideRating 
                    rideId={ride?.id}
                    role="DRIVER"
                    personName={ride?.rider?.first_name || ride?.rider?.user?.first_name}
                    personRole="Rider"
                    onComplete={() => navigate('/driver', { replace: true })}
                />
            )}
        </div>
    );
}
