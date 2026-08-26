import { toast } from 'sonner';
import { Menu, Navigation, Power } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RideOfferModal from '../../components/driver/RideOfferModal';
import Navbar from '../../components/shared/layout/Navbar';
import { useDriverPing, useDriverToggle } from '../../hooks/driver';
import { useRideAcceptDriver, useRideDetails } from '../../hooks/rider';
import { useDriverLocationPing } from '../../hooks/useDriverLocationPing';
import { useDriverWebSocket } from '../../contexts/DriverWebSocketContext';
import LocationSender from '../../utils/currentLocationHelper';
import StaticRouteMap from '../../components/shared/StaticRouteMap';
import { motion } from 'framer-motion';

export default function DriverDashboard() {
    const [isOnline, setIsOnline] = useState(() => {
        return sessionStorage.getItem('driverIsOnline') === 'true';
    });
    const [showOffer, setShowOffer] = useState(false);
    const [rideOffer, setRideOffer] = useState({});
    const navigate = useNavigate();

    const { mutate: driverToggle } = useDriverToggle();
    const { mutate: driverLoc } = useDriverPing();
    const { mutateAsync: rideAccept } = useRideAcceptDriver();
    const { data: activeRideResp } = useRideDetails();

    const activeRide = activeRideResp?.data;

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
                const data = {
                    "lat": location.loc.lat,
                    "lng": location.loc.lng
                }
                driverToggle({ online: true });
                driverLoc(data);
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
            <div className="fixed inset-0 top-[60px] flex flex-col bg-[#0d0d12] overflow-hidden">
                {/* Top Navigation / Floating Actions */}
                <div className="absolute top-0 left-0 right-0 z-20 p-4 pt-6 flex justify-between items-start pointer-events-none">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-3 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.5)] pointer-events-auto cursor-pointer border"
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                            borderColor: 'rgba(255,255,255,0.1)'
                        }}
                        onClick={() => navigate('/driver/profile')}
                    >
                        <Menu className="w-5 h-5 text-white" />
                    </motion.button>

                    {!activeRide && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleOnlineMode}
                            className="pointer-events-auto flex items-center gap-2 px-5 py-3 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.5)] cursor-pointer border"
                            style={{
                                background: isOnline ? 'linear-gradient(135deg,#7c3aed,#5b21b6)' : 'rgba(255,255,255,0.05)',
                                borderColor: isOnline ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.1)'
                            }}
                        >
                            <span className={`text-xs font-bold tracking-widest uppercase ${isOnline ? 'text-white' : 'text-gray-400'}`}>
                                {isOnline ? 'GO OFFLINE' : 'GO ONLINE'}
                            </span>
                            <Power className={`w-4 h-4 ${isOnline ? 'text-white' : 'text-gray-500'}`} />
                        </motion.button>
                    )}
                </div>

                {/* Map Area */}
                <div className="flex-1 relative z-0 flex items-center justify-center bg-[#0d0d12]">
                    {(!isOnline && !activeRide) ? (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col items-center justify-center p-8 text-center z-10"
                        >
                            <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 relative overflow-hidden"
                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                            >
                                <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ border: '2px solid rgba(255,255,255,0.2)' }}></div>
                                <Power className="w-10 h-10 text-gray-600" />
                            </div>
                            <h2 className="text-2xl font-black text-white mb-3 tracking-tight">Offline</h2>
                            <p className="text-gray-500 font-medium max-w-[260px] leading-relaxed text-sm">
                                Go online to start receiving ride requests.
                            </p>
                        </motion.div>
                    ) : (
                        <StaticRouteMap pickup={driverLocation} isOnline={isOnline && !activeRide} />
                    )}

                    {/* Gradient overlay to blend bottom sheet */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10"
                        style={{ background: 'linear-gradient(to top, #0d0d12, transparent)' }}
                    />
                </div>

                {/* Compact Bottom Sheet */}
                <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="rounded-t-3xl p-5 z-20 relative shrink-0"
                    style={{
                        background: 'linear-gradient(180deg,#1a1a2e 0%,#13131f 100%)',
                        borderTop: '1px solid rgba(139,92,246,0.18)',
                    }}
                >
                    <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: 'rgba(255,255,255,0.15)' }} />

                    {activeRide ? (
                        <div className="flex items-center justify-between py-2 px-2">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                                    style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}
                                >
                                    <Navigation className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white tracking-tight">Active Ride</h2>
                                    <p className="text-gray-400 text-sm font-medium">You have an ongoing trip.</p>
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/driver/active')}
                                className="px-5 py-2.5 rounded-full font-bold text-xs tracking-wider text-white shadow-lg cursor-pointer border"
                                style={{
                                    background: 'linear-gradient(135deg,#7c3aed,#5b21b6)',
                                    borderColor: 'rgba(139,92,246,0.5)',
                                }}
                            >
                                VIEW
                            </motion.button>
                        </div>
                    ) : isOnline ? (
                        <div className="flex items-center justify-between py-2 px-2">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="absolute inset-0 rounded-full animate-ping" style={{ background: 'rgba(139,92,246,0.2)' }}></div>
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center relative z-10 shadow-[0_0_15px_rgba(139,92,246,0.4)] border border-violet-500/50"
                                        style={{ background: 'rgba(139,92,246,0.1)' }}
                                    >
                                        <Navigation className="w-5 h-5 text-violet-400 animate-pulse" />
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white tracking-tight">Finding rides...</h2>
                                    <p className="text-violet-300 text-sm font-medium">You're in a busy area.</p>
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleOnlineMode}
                                className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer border"
                                style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
                            >
                                <Power className="w-5 h-5 text-gray-400" />
                            </motion.button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between py-2 px-2">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center border"
                                    style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}
                                >
                                    <Power className="w-5 h-5 text-gray-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white tracking-tight">You're offline</h2>
                                    <p className="text-gray-500 text-sm font-medium">Tap to start receiving requests.</p>
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
