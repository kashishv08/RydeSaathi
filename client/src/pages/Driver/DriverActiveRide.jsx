import { toast } from 'sonner';
import { MessageSquare, Navigation, Phone, Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ActiveTrackingMap from '../../components/shared/ActiveTrackingMap';
import { RIDE_STATUS } from '../../constants';
import { useDriverWebSocket } from '../../contexts/DriverWebSocketContext';
import { useTransitionRide } from '../../hooks/driver';
import { useFetchRoutePolyline, useRideDetails } from '../../hooks/rider';
import { useDriverLocationPing } from '../../hooks/useDriverLocationPing';
import { getDynamicEtaMins } from '../../utils/geoHelpers';
import { motion } from 'framer-motion';

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
            case RIDE_STATUS.ACCEPTED: return "Arrived at Pickup";
            case RIDE_STATUS.ARRIVED: return "Start Ride";
            case RIDE_STATUS.IN_PROGRESS: return "Complete Ride";
            default: return "";
        }
    };

    if (!ride) return <div className="h-screen bg-[#0d0d12] flex items-center justify-center text-white">Loading ride details...</div>;

    return (
        <div className="fixed inset-0 bg-[#0d0d12] font-sans overflow-hidden">
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
                <div className="absolute bottom-0 left-0 right-0 h-56 pointer-events-none z-10"
                    style={{ background: 'linear-gradient(to top, #0d0d12, transparent)' }}
                />
            </div>

            {/* Top Floating Header */}
            <div className="absolute top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-xl z-20 pointer-events-none flex justify-between items-start">
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/driver')} 
                    className="w-12 h-12 rounded-full flex items-center justify-center pointer-events-auto cursor-pointer border"
                    style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                        <path d="m15 18-6-6 6-6"/>
                    </svg>
                </motion.button>

                <div className="px-6 py-3 rounded-full pointer-events-auto flex flex-col items-center border shadow-lg"
                    style={{
                        background: 'rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(10px)',
                        borderColor: 'rgba(255,255,255,0.1)'
                    }}
                >
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-white">{getStatusText()}</span>
                    {rideStatus === RIDE_STATUS.IN_PROGRESS && (
                        <span className="text-emerald-400 font-bold text-sm mt-0.5">ETA: {driverloc && routeData && routeEndPoint ? getDynamicEtaMins(driverloc, routeEndPoint, routeData.durationSeconds) : '...'} min</span>
                    )}
                </div>

                {/* Empty spacer for flex alignment */}
                <div className="w-12 h-12"></div>
            </div>

            {/* Bottom Floating Card */}
            <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[400px] rounded-[2rem] z-20 overflow-hidden pointer-events-auto border"
                style={{
                    background: 'linear-gradient(180deg,#1a1a2e 0%,#13131f 100%)',
                    borderColor: 'rgba(139,92,246,0.3)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 40px rgba(139,92,246,0.1)'
                }}
            >
                <div className="p-5">
                    {/* Rider Info Row */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gray-800 rounded-full overflow-hidden border-2 shadow-sm relative"
                                style={{ borderColor: 'rgba(139,92,246,0.5)' }}
                            >
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rider" alt="Rider" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white leading-none mb-1.5">{ride.rider_email ? ride.rider_email.split('@')[0] : "Rider"}</h3>
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md border"
                                    style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
                                >
                                    <span className="text-white text-xs font-bold">4.9</span>
                                    <span className="text-violet-400 text-xs">★</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-11 h-11 rounded-full flex items-center justify-center border cursor-pointer"
                                style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
                            >
                                <MessageSquare className="w-5 h-5 text-gray-300" />
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-11 h-11 rounded-full flex items-center justify-center cursor-pointer border"
                                style={{ background: 'rgba(16,185,129,0.15)', borderColor: 'rgba(16,185,129,0.3)' }}
                            >
                                <Phone className="w-5 h-5 text-emerald-400" />
                            </motion.button>
                        </div>
                    </div>

                    <hr className="border-t mb-5" style={{ borderColor: 'rgba(255,255,255,0.08)' }} />

                    {/* Route Info */}
                    <div className="mb-6 flex gap-3">
                        <div className="flex flex-col items-center mt-1 shrink-0">
                            <div className="w-3 h-3 rounded-full flex items-center justify-center"
                                style={{
                                    background: rideStatus === RIDE_STATUS.ACCEPTED || rideStatus === RIDE_STATUS.ARRIVED ? 'rgba(139,92,246,0.2)' : 'rgba(16,185,129,0.2)',
                                    border: `1px solid ${rideStatus === RIDE_STATUS.ACCEPTED || rideStatus === RIDE_STATUS.ARRIVED ? 'rgba(139,92,246,0.5)' : 'rgba(16,185,129,0.5)'}`
                                }}
                            >
                                <div className="w-1.5 h-1.5 rounded-full"
                                    style={{ background: rideStatus === RIDE_STATUS.ACCEPTED || rideStatus === RIDE_STATUS.ARRIVED ? '#8b5cf6' : '#10b981' }}
                                ></div>
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                {rideStatus === RIDE_STATUS.ACCEPTED || rideStatus === RIDE_STATUS.ARRIVED ? "Navigating to Pickup" : "Navigating to Drop-off"}
                            </p>
                            <h4 className="text-base font-bold text-white leading-snug">
                                {rideStatus === RIDE_STATUS.ACCEPTED || rideStatus === RIDE_STATUS.ARRIVED ? ride.pickup_address : ride.drop_address}
                            </h4>
                        </div>
                    </div>

                    {/* OTP Input */}
                    {rideStatus === RIDE_STATUS.ARRIVED && (
                        <div className="mb-6 p-4 rounded-2xl border"
                            style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}
                        >
                            <p className="text-xs font-bold text-gray-300 mb-3 text-center tracking-widest uppercase">Enter Rider PIN</p>
                            <input
                                type="text"
                                maxLength="4"
                                value={otpInput}
                                onChange={(e) => setOtpInput(e.target.value.replace(/[^0-9]/g, ''))}
                                placeholder="----"
                                className="w-full text-center text-3xl font-black tracking-[1em] py-3 rounded-xl outline-none"
                                style={{
                                    background: 'rgba(139,92,246,0.05)',
                                    color: '#fff',
                                    border: '1px solid rgba(139,92,246,0.2)',
                                }}
                            />
                        </div>
                    )}

                    {/* Action Button */}
                    {rideStatus !== RIDE_STATUS.COMPLETED && rideStatus !== 'PAYMENT_SUCCESSFULL' && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleAction}
                            className="w-full py-4 rounded-2xl font-bold text-base flex justify-center items-center gap-2 cursor-pointer border"
                            style={{
                                background: rideStatus === RIDE_STATUS.ARRIVED 
                                    ? 'linear-gradient(135deg,#7c3aed,#5b21b6)'
                                    : 'linear-gradient(135deg,#10b981,#059669)',
                                color: '#fff',
                                borderColor: rideStatus === RIDE_STATUS.ARRIVED ? 'rgba(139,92,246,0.5)' : 'rgba(16,185,129,0.5)',
                                boxShadow: rideStatus === RIDE_STATUS.ARRIVED ? '0 6px 20px rgba(124,58,237,0.4)' : '0 6px 20px rgba(16,185,129,0.4)'
                            }}
                        >
                            {getActionText()}
                        </motion.button>
                    )}

                    {(rideStatus === RIDE_STATUS.COMPLETED || rideStatus === 'PAYMENT_SUCCESSFULL') && (
                        <div className="w-full py-4 rounded-2xl font-bold text-base flex justify-center items-center gap-2 border"
                            style={{
                                background: 'rgba(16,185,129,0.1)',
                                color: '#34d399',
                                borderColor: 'rgba(16,185,129,0.3)',
                            }}
                        >
                            <Check className="w-5 h-5" />
                            {rideStatus === 'PAYMENT_SUCCESSFULL' ? 'Payment Received' : 'Waiting for Payment...'}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
