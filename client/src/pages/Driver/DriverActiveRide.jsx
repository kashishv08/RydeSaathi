import { motion } from 'framer-motion';
import { Check, MessageSquare, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ActiveTrackingMap from '../../components/shared/ActiveTrackingMap';
import RideRating from '../../components/shared/RideRating';
import { RIDE_STATUS } from '../../constants';
import { useDriverWebSocket } from '../../contexts/DriverWebSocketContext';
import { useTransitionRide } from '../../hooks/driver';
import { useFetchRoutePolyline, useRideDetails } from '../../hooks/rider';
import { useDriverLocationPing } from '../../hooks/useDriverLocationPing';
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
            case RIDE_STATUS.ACCEPTED: return "Arrived at Pickup";
            case RIDE_STATUS.ARRIVED: return "Start Ride";
            case RIDE_STATUS.IN_PROGRESS: return "Complete Ride";
            default: return "";
        }
    };

    if (!ride) return <div className="h-screen flex items-center justify-center" style={{ background: 'var(--clr-bg)', color: 'var(--clr-foreground)' }}>Loading ride details...</div>;

    return (
        <div className="fixed inset-0 font-sans overflow-hidden grain" style={{ background: 'var(--clr-bg)' }}>
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

                <div className="absolute bottom-0 left-0 right-0 h-56 pointer-events-none z-10"
                    style={{ background: 'linear-gradient(to top, var(--clr-card), transparent)' }}
                />
            </div>

            {/* Top Floating Header */}
            <div className="absolute top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-xl z-20 pointer-events-none flex justify-between items-start">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/driver')}
                    className="w-12 h-12 rounded-full flex items-center justify-center pointer-events-auto cursor-pointer border"
                    style={{ background: 'var(--clr-card)', borderColor: 'var(--clr-border)', boxShadow: '0 2px 12px rgba(27,54,58,0.1)' }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--clr-foreground)' }}>
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                </motion.button>

                <div className="px-6 py-3 rounded-full pointer-events-auto flex flex-col items-center border shadow-lg"
                    style={{
                        background: 'var(--clr-card)',
                        backdropFilter: 'blur(10px)',
                        borderColor: 'var(--clr-border)',
                        boxShadow: '0 4px 16px rgba(27,54,58,0.12)',
                    }}
                >
                    <span className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: 'var(--clr-foreground)' }}>{getStatusText()}</span>
                    {rideStatus === RIDE_STATUS.IN_PROGRESS && (
                        <span className="font-bold text-sm mt-0.5" style={{ color: 'var(--clr-primary)' }}>ETA: {driverloc && routeData && routeEndPoint ? getDynamicEtaMins(driverloc, routeEndPoint, routeData.durationSeconds) : '...'} min</span>
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
                    background: 'var(--clr-card)',
                    borderColor: 'hsl(169,59%,31%,0.25)',
                    boxShadow: '0 -4px 40px rgba(27,54,58,0.12), 0 8px 40px rgba(27,54,58,0.08)',
                }}
            >
                <div className="p-5">
                    {/* Rider Info Row */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full overflow-hidden border-2 shadow-sm relative"
                                style={{ borderColor: 'color-mix(in srgb, var(--clr-primary) 40%, transparent)' }}
                            >
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rider" alt="Rider" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black leading-none mb-1.5" style={{ color: 'var(--clr-foreground)' }}>{ride.rider_email ? ride.rider_email.split('@')[0] : "Rider"}</h3>
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md border"
                                    style={{ background: 'var(--clr-border)', borderColor: 'var(--clr-border)' }}
                                >
                                    <span className="text-xs font-bold" style={{ color: 'var(--clr-foreground)' }}>4.9</span>
                                    <span className="text-xs" style={{ color: 'hsl(39,66%,50%)' }}>★</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-11 h-11 rounded-full flex items-center justify-center border cursor-pointer"
                                style={{ background: 'var(--clr-border)', borderColor: 'var(--clr-border)' }}
                            >
                                <MessageSquare className="w-5 h-5" style={{ color: 'var(--clr-muted)' }} />
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-11 h-11 rounded-full flex items-center justify-center cursor-pointer border"
                                style={{ background: 'hsl(169,59%,31%,0.1)', borderColor: 'hsl(169,59%,31%,0.3)' }}
                            >
                                <Phone className="w-5 h-5" style={{ color: 'var(--clr-primary)' }} />
                            </motion.button>
                        </div>
                    </div>

                    <hr className="border-t mb-5" style={{ borderColor: 'var(--clr-border)' }} />

                    {/* Route Info */}
                    <div className="mb-6 flex gap-3">
                        <div className="flex flex-col items-center mt-1 shrink-0">
                            <div className="w-3 h-3 rounded-full flex items-center justify-center"
                                style={{
                                    background: rideStatus === RIDE_STATUS.ACCEPTED || rideStatus === RIDE_STATUS.ARRIVED ? 'hsl(169,59%,31%,0.15)' : 'color-mix(in srgb, var(--clr-primary) 20%, transparent)',
                                    border: `1px solid hsl(169,59%,31%,0.45)`
                                }}
                            >
                                <div className="w-1.5 h-1.5 rounded-full"
                                    style={{ background: 'var(--clr-primary)' }}
                                ></div>
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: 'var(--clr-muted)' }}>
                                {rideStatus === RIDE_STATUS.ACCEPTED || rideStatus === RIDE_STATUS.ARRIVED ? "Navigating to Pickup" : "Navigating to Drop-off"}
                            </p>
                            <h4 className="text-base font-bold leading-snug" style={{ color: 'var(--clr-foreground)' }}>
                                {rideStatus === RIDE_STATUS.ACCEPTED || rideStatus === RIDE_STATUS.ARRIVED ? ride.pickup_address : ride.drop_address}
                            </h4>
                        </div>
                    </div>

                    {/* OTP Input */}
                    {rideStatus === RIDE_STATUS.ARRIVED && (
                        <div className="mb-6 p-4 rounded-2xl border"
                            style={{ background: 'hsl(38,24%,96%)', borderColor: 'var(--clr-border)' }}
                        >
                            <p className="text-xs font-bold mb-3 text-center tracking-widest uppercase" style={{ color: 'var(--clr-muted)' }}>Enter Rider PIN</p>
                            <input
                                type="text"
                                maxLength="4"
                                value={otpInput}
                                onChange={(e) => setOtpInput(e.target.value.replace(/[^0-9]/g, ''))}
                                placeholder="----"
                                className="w-full text-center text-3xl font-black tracking-[1em] py-3 rounded-xl outline-none"
                                style={{
                                    background: 'hsl(169,59%,31%,0.06)',
                                    color: 'var(--clr-foreground)',
                                    border: '1px solid hsl(169,59%,31%,0.25)',
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
                                background: 'linear-gradient(135deg,var(--clr-primary),hsl(169,59%,20%))',
                                color: 'var(--clr-card)',
                                borderColor: 'hsl(169,59%,31%,0.5)',
                                boxShadow: '0 6px 20px hsl(169,59%,31%,0.35)',
                            }}
                        >
                            {getActionText()}
                        </motion.button>
                    )}

                    {(rideStatus === RIDE_STATUS.COMPLETED || rideStatus === 'PAYMENT_SUCCESSFULL') && (
                        <div className="w-full py-4 rounded-2xl font-bold text-base flex justify-center items-center gap-2 border"
                            style={{
                                background: 'hsl(169,59%,31%,0.1)',
                                color: 'var(--clr-primary)',
                                borderColor: 'hsl(169,59%,31%,0.3)',
                            }}
                        >
                            <Check className="w-5 h-5" />
                            {rideStatus === 'PAYMENT_SUCCESSFULL' ? 'Payment Received' : 'Waiting for Payment...'}
                        </div>
                    )}
                </div>
            </motion.div>

            {rideStatus === 'PAYMENT_SUCCESSFULL' && (
                <RideRating
                    rideId={ride?.id}
                    role="DRIVER"
                    personName={ride?.rider_email ? ride.rider_email.split('@')[0] : "Rider"}
                    personRole="Rider"
                    onComplete={() => navigate('/driver')}
                />
            )}
        </div>
    );
}
