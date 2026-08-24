import { MessageSquare, Navigation, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDriverLocationPing } from '../../hooks/useDriverLocationPing';
import { useTransitionRide } from '../../hooks/driver';
import { useRideDetails } from '../../hooks/rider';
import { RIDE_STATUS } from '../../constants';
import LocationSender from '../../utils/currentLocationHelper';
import { getDistanceFromLatLonInKm } from '../../utils/geoHelpers';
import { toast } from '@heroui/react';
import { useDriverWebSocket } from '../../contexts/DriverWebSocketContext';

export default function DriverActiveRide() {
    const navigate = useNavigate();
    const { state } = useLocation();

    useDriverLocationPing(true);

    const { mutate: rideTransition } = useTransitionRide();
    const { data: rideDetailResponse } = useRideDetails();

    const ride = rideDetailResponse?.data;

    const [rideStatus, setRideStatus] = useState(ride?.status || RIDE_STATUS.ACCEPTED);
    const [otpInput, setOtpInput] = useState('');

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
                navigate('/driver');
            } else if (lastMessage.ride_status === "CANCELLED") {
                toast.error("The rider has cancelled the trip.");
                navigate('/driver');
            }
        }
    }, [lastMessage, navigate]);

    const handleAction = async () => {
        if (rideStatus === RIDE_STATUS.ACCEPTED) {
            // const currentLoc = await LocationSender();
            // // if (currentLoc?.loc && ride?.pickup_lat) {
            // //     const distKm = getDistanceFromLatLonInKm(
            // //         currentLoc.loc.lat, currentLoc.loc.lng,
            // //         parseFloat(ride.pickup_lat), parseFloat(ride.pickup_lng)
            // //     );

            // //     if (distKm > 0.25) {
            // //         toast.info(`You are still ${Math.round(distKm * 1000)} meters away from the pickup point. Get closer to mark as arrived.`);
            // //         return;
            // //     }
            // // }

            setRideStatus(RIDE_STATUS.ARRIVED);
            rideTransition({ ride_id: ride.id, status: RIDE_STATUS.ARRIVED });
        } else if (rideStatus === RIDE_STATUS.ARRIVED) {
            console.log(otpInput, ride.ride_otp)
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
            case RIDE_STATUS.ARRIVED: return "Verify OTP & Start";
            case RIDE_STATUS.IN_PROGRESS: return "Complete Ride";
            default: return "";
        }
    };

    if (!ride) return <div className="h-screen flex items-center justify-center">Loading ride details...</div>;

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-gray-50 relative font-sans">
            {/* Header */}
            <div className="bg-white px-6 py-4 shadow-sm z-20 flex justify-between items-center fixed top-0 w-full">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer">
                    <Navigation className="w-5 h-5 text-black transform -rotate-45" />
                </div>
                <div className="text-center">
                    <h2 className="text-lg font-bold text-black">{getStatusText()}</h2>
                    {rideStatus === RIDE_STATUS.ACCEPTED && <p className="text-blue-600 font-semibold text-sm">3 min away</p>}
                </div>
                <div className="w-10 h-10"></div>
            </div>

            {/* Map Area (Simulation) */}
            <div className="flex-1 bg-gray-200 relative pt-32">
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>

                {/* Route Polyline Simulation */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-l-4 border-t-4 border-black rounded-tl-3xl opacity-50 pointer-events-none"></div>
            </div>

            {/* Bottom Sheet */}
            <div className="bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-6 z-20 relative">
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>

                {/* Rider Info */}
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gray-200 rounded-full overflow-hidden border-2 border-white shadow-md">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rider" alt="Rider" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-black">{ride.rider_email ? ride.rider_email.split('@')[0] : "Rider"}</h3>
                            <p className="text-gray-500 font-semibold text-sm">⭐ 4.9</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                            <MessageSquare className="w-5 h-5 text-black" />
                        </button>
                        <button className="w-12 h-12 rounded-full bg-black flex items-center justify-center shadow-lg shadow-black/20 hover:scale-105 transition-transform">
                            <Phone className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>

                {/* Ride Details */}
                <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">PICKUP</p>
                            <p className="font-semibold text-black text-lg line-clamp-1">{ride.pickup_address}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                            <div className="w-2.5 h-2.5 bg-black"></div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">DROP-OFF</p>
                            <p className="font-semibold text-black text-lg line-clamp-1">{ride.drop_address}</p>
                        </div>
                    </div>
                </div>

                {/* OTP Input for Arrived State */}
                {rideStatus === RIDE_STATUS.ARRIVED && (
                    <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <p className="text-sm font-semibold text-black mb-2 text-center">Ask Rider for the 4-digit PIN</p>
                        <input
                            type="text"
                            maxLength="4"
                            value={otpInput}
                            onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                            placeholder="0000"
                            className="w-full text-center text-3xl font-bold tracking-[1em] py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                        />
                    </div>
                )}

                {/* Main Action Button */}
                {rideStatus !== RIDE_STATUS.COMPLETED && (
                    <button
                        onClick={handleAction}
                        className="w-full bg-black text-white font-bold py-5 rounded-xl text-xl hover:bg-gray-800 transition-colors shadow-xl relative overflow-hidden group"
                    >
                        <span className="relative z-10">{getActionText()}</span>
                        {/* Simulated shine effect */}
                        <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
                    </button>
                )}
            </div>
        </div>
    );
}
