import { motion } from 'framer-motion';
import { Menu, Navigation, Power } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import RideOfferModal from '../../components/driver/RideOfferModal';
import Navbar from '../../components/shared/layout/Navbar';
import StaticRouteMap from '../../components/shared/StaticRouteMap';
import { useDriverWebSocket } from '../../contexts/DriverWebSocketContext';
import { useDriverToggle, useDriverProfile } from '../../hooks/driver';
import { useRideAcceptDriver, useRideDetails } from '../../hooks/rider';
import { useDriverLocationPing } from '../../hooks/useDriverLocationPing';
import LocationSender from '../../utils/currentLocationHelper';

export default function DriverDashboard() {
    const [isOnline, setIsOnline] = useState(() => {
        return sessionStorage.getItem('driverIsOnline') === 'true';
    });
    const [showOffer, setShowOffer] = useState(false);
    const [rideOffer, setRideOffer] = useState({});
    const navigate = useNavigate();

    const { mutate: driverToggle } = useDriverToggle();
    const { mutateAsync: rideAccept } = useRideAcceptDriver();
    const { data: activeRideResp } = useRideDetails();
    const { socket } = useDriverWebSocket();
    const { data: profileResponse, isLoading: profileLoading } = useDriverProfile();

    const activeRide = activeRideResp?.data;

    useEffect(() => {
        if (!profileLoading && profileResponse?.data && !profileResponse.data.vehicle) {
            navigate("/driver/onboarding", { replace: true });
        }
    }, [profileResponse, profileLoading, navigate]);

    async function handleOnlineMode() {
        if (!isOnline) {
            setIsOnline(true);
            sessionStorage.setItem('driverIsOnline', 'true');

            const location = await LocationSender();

            if (!location || location.error) {
                setIsOnline(false);
                sessionStorage.setItem('driverIsOnline', 'false');
                if (location?.error) toast.error(location.error);
                return;
            }

            if (location?.loc) {
                driverToggle({ online: true });
                if (socket) {
                    socket.send(JSON.stringify({
                        "event": "location_update",
                        "lng": location.loc.lng,
                        "lat": location.loc.lat
                    }));
                }
            }
        } else {
            setIsOnline(false);
            sessionStorage.setItem('driverIsOnline', 'false');
            driverToggle({ online: false });
        }
    }

    const driverLocation = useDriverLocationPing(isOnline);
    const { lastMessage } = useDriverWebSocket();

    useEffect(() => {
        if (!lastMessage) return;

        if (lastMessage.type === 'ride_offer') {
            setShowOffer(true);
            setRideOffer({
                pickup_address: lastMessage.pickup_address,
                drop_address: lastMessage.drop_address,
                distance_km: lastMessage.route_distance_km,
                duration_min: lastMessage.route_duration_min,
                amount: lastMessage.amount,
                timeout: lastMessage.timeout,
                ride_id: lastMessage.ride_id
            });
        }

        if (lastMessage.type === 'cancel_ride_offer') {
            setShowOffer(false);
            setRideOffer(null);
        }
    }, [lastMessage]);

    const handleAccept = async () => {
        setShowOffer(false);
        try {
            await rideAccept(rideOffer.ride_id);
            navigate('/driver/active', { state: { ride_id: rideOffer.ride_id } });
        } catch (error) {
            console.error("Failed to accept ride", error);
            toast.error("Failed to accept ride. Another driver may have taken it.");
        }
    };

    const handleDecline = () => {
        setShowOffer(false);
    };

    return (
        <>
            <Navbar />
            <div className="fixed inset-0 top-[60px] flex flex-col overflow-hidden grain" style={{ background: 'var(--clr-bg)' }}>
                {/* Top Navigation / Floating Actions */}
                <div className="absolute top-0 left-0 right-0 z-20 p-4 pt-6 flex justify-between items-start pointer-events-none">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-3 rounded-full shadow-md pointer-events-auto cursor-pointer border"
                        style={{
                            background: 'var(--clr-card)',
                            borderColor: 'var(--clr-border)'
                        }}
                        onClick={() => navigate('/driver/profile')}
                    >
                        <Menu className="w-5 h-5" style={{ color: 'var(--clr-foreground)' }} />
                    </motion.button>

                    {!activeRide && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleOnlineMode}
                            className="pointer-events-auto flex items-center gap-2 px-5 py-3 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.5)] cursor-pointer border"
                            style={{
                                background: isOnline ? 'linear-gradient(135deg,var(--clr-primary),hsl(169,59%,20%))' : 'var(--clr-card)',
                                borderColor: isOnline ? 'hsl(169,59%,31%,0.5)' : 'var(--clr-border)',
                                boxShadow: isOnline ? '0 4px 16px hsl(169,59%,31%,0.3)' : '0 2px 8px rgba(27,54,58,0.1)',
                            }}
                        >
                            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: isOnline ? 'var(--clr-card)' : 'var(--clr-muted)' }}>
                                {isOnline ? 'GO OFFLINE' : 'GO ONLINE'}
                            </span>
                            <Power className="w-4 h-4" style={{ color: isOnline ? 'var(--clr-card)' : 'hsl(193,15%,55%)' }} />
                        </motion.button>
                    )}
                </div>

                {/* Map Area */}
                <div className="flex-1 relative z-0 flex items-center justify-center" style={{ background: 'var(--clr-bg)' }}>
                    {(!isOnline && !activeRide) ? (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col items-center justify-center p-8 text-center z-10"
                        >
                            <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 relative overflow-hidden"
                                style={{ background: 'var(--clr-card)', border: '1px solid var(--clr-border)', boxShadow: '0 8px 30px rgba(27,54,58,0.08)' }}
                            >
                                <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ border: '2px solid hsl(169,59%,31%,0.3)' }}></div>
                                <Power className="w-10 h-10" style={{ color: 'hsl(193,15%,55%)' }} />
                            </div>
                            <h2 className="text-2xl font-black mb-3 tracking-tight" style={{ color: 'var(--clr-foreground)', fontFamily: "'Manrope',sans-serif" }}>Offline</h2>
                            <p className="font-medium max-w-[260px] leading-relaxed text-sm" style={{ color: 'var(--clr-muted)' }}>
                                Go online to start receiving ride requests.
                            </p>
                        </motion.div>
                    ) : (
                        <StaticRouteMap pickup={driverLocation} isOnline={isOnline && !activeRide} />
                    )}

                    {/* Gradient overlay to blend bottom sheet */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10"
                        style={{ background: 'linear-gradient(to top, var(--clr-card), transparent)' }}
                    />
                </div>

                {/* Compact Bottom Sheet */}
                <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="rounded-t-3xl p-5 z-20 relative shrink-0"
                    style={{
                        background: 'var(--clr-card)',
                        borderTop: '1px solid var(--clr-border)',
                        boxShadow: '0 -4px 20px rgba(27,54,58,0.06)',
                    }}
                >
                    <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: 'hsl(38,24%,84%)' }} />

                    {activeRide ? (
                        <div className="flex items-center justify-between py-2 px-2">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                                    style={{ background: 'color-mix(in srgb, var(--clr-primary) 12%, transparent)', border: '1px solid hsl(169,59%,31%,0.25)' }}
                                >
                                    <Navigation className="w-5 h-5" style={{ color: 'var(--clr-primary)' }} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold tracking-tight" style={{ color: 'var(--clr-foreground)' }}>Active Ride</h2>
                                    <p className="text-sm font-medium" style={{ color: 'var(--clr-muted)' }}>You have an ongoing trip.</p>
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/driver/active')}
                                className="px-5 py-2.5 rounded-full font-bold text-xs tracking-wider shadow-lg cursor-pointer border"
                                style={{
                                    background: 'linear-gradient(135deg,var(--clr-primary),hsl(169,59%,20%))',
                                    borderColor: 'hsl(169,59%,31%,0.5)',
                                    color: 'var(--clr-card)',
                                }}
                            >
                                VIEW
                            </motion.button>
                        </div>
                    ) : isOnline ? (
                        <div className="flex items-center justify-between py-2 px-2">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="absolute inset-0 rounded-full animate-ping" style={{ background: 'color-mix(in srgb, var(--clr-primary) 20%, transparent)' }}></div>
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center relative z-10 border"
                                        style={{ background: 'hsl(169,59%,31%,0.1)', borderColor: 'color-mix(in srgb, var(--clr-primary) 40%, transparent)', boxShadow: '0 0 15px hsl(169,59%,31%,0.3)' }}
                                    >
                                        <Navigation className="w-5 h-5 animate-pulse" style={{ color: 'var(--clr-primary)' }} />
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold tracking-tight" style={{ color: 'var(--clr-foreground)' }}>Finding rides...</h2>
                                    <p className="text-sm font-medium" style={{ color: 'var(--clr-primary)' }}>You're in a busy area.</p>
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleOnlineMode}
                                className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer border"
                                style={{ background: 'var(--clr-border)', borderColor: 'var(--clr-border)' }}
                            >
                                <Power className="w-5 h-5" style={{ color: 'var(--clr-muted)' }} />
                            </motion.button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between py-2 px-2">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center border"
                                    style={{ background: 'var(--clr-border)', borderColor: 'var(--clr-border)' }}
                                >
                                    <Power className="w-5 h-5" style={{ color: 'hsl(193,15%,55%)' }} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold tracking-tight" style={{ color: 'var(--clr-foreground)' }}>You're offline</h2>
                                    <p className="text-sm font-medium" style={{ color: 'var(--clr-muted)' }}>Tap to start receiving requests.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>

            <RideOfferModal
                isOpen={showOffer}
                offer={rideOffer}
                onAccept={handleAccept}
                onDecline={handleDecline}
            />
        </>
    );
}
