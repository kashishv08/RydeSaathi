import { toast } from '@heroui/react';
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

export default function DriverDashboard() {
    const [isOnline, setIsOnline] = useState(() => {
        return sessionStorage.getItem('driverIsOnline') === 'true';
    });
    const [showOffer, setShowOffer] = useState(false);
    const [rideOffer, setRideOffer] = useState({});
    const navigate = useNavigate();

    const { mutate: driverToggle } = useDriverToggle();
    const { mutate: driverLoc, data: driverData } = useDriverPing();
    const { mutateAsync: rideAccept } = useRideAcceptDriver();
    const { data: activeRideResp } = useRideDetails();
    
    const activeRide = activeRideResp?.data;

    async function handleOnlineMode() {
        if (!isOnline) {
            // Optimistic update for instant UI feedback
            setIsOnline(true);
            sessionStorage.setItem('driverIsOnline', 'true');

            const location = await LocationSender();
            
            if (!location || location.error) {
                // Revert if failed
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
            // Instant offline
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
            <div className="fixed inset-0 top-[60px] flex flex-col bg-gray-50 overflow-hidden">
                {/* Top Navigation / Floating Actions */}
                <div className="absolute top-0 left-0 right-0 z-20 p-4 pt-6 flex justify-between items-start pointer-events-none">
                    <button className="bg-white p-3 rounded-full shadow-lg shadow-black/5 pointer-events-auto hover:scale-105 transition-transform cursor-pointer" onClick={() => navigate('/driver/profile')}>
                        <Menu className="w-6 h-6 text-black" />
                    </button>

                    {!activeRide && (
                        <button 
                            onClick={handleOnlineMode}
                            className={`pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg shadow-black/5 transition-all cursor-pointer ${isOnline ? 'bg-black text-white' : 'bg-white text-black'}`}
                        >
                            <span className="text-sm font-bold tracking-wide uppercase">
                                {isOnline ? 'GO OFFLINE' : 'GO ONLINE'}
                            </span>
                            <Power className={`w-4 h-4 ${isOnline ? 'text-white' : 'text-gray-400'}`} />
                        </button>
                    )}
                </div>

                {/* Map Area */}
                <div className="flex-1 relative z-0 flex items-center justify-center bg-gray-50">
                    {(!isOnline && !activeRide) ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center animate-in zoom-in-95 fade-in duration-500 z-10">
                            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6 shadow-inner relative overflow-hidden">
                                <div className="absolute inset-0 border-4 border-gray-300 rounded-full animate-ping opacity-20"></div>
                                <Power className="w-10 h-10 text-gray-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">Nothing on the radar yet</h2>
                            <p className="text-gray-500 font-medium max-w-[280px] leading-relaxed">
                                Go online to see nearby ride requests and make your next trip count.
                            </p>
                        </div>
                    ) : (
                        <StaticRouteMap pickup={driverLocation} isOnline={isOnline && !activeRide} />
                    )}

                    {/* Gradient overlay for smooth transition to bottom sheet */}
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/5 to-transparent pointer-events-none z-10"></div>
                </div>

                {/* Compact Bottom Sheet */}
                <div className="bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.08)] p-5 z-20 relative shrink-0">
                    <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4"></div>

                    {activeRide ? (
                        <div className="flex items-center justify-between py-2 px-2">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-md">
                                    <Navigation className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 tracking-tight">Active Ride</h2>
                                    <p className="text-gray-500 text-sm font-medium">You have an ongoing trip.</p>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/driver/active')}
                                className="bg-black text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-gray-900 shadow-md active:scale-95 transition-all cursor-pointer"
                            >
                                VIEW
                            </button>
                        </div>
                    ) : isOnline ? (
                        <div className="flex items-center justify-between py-2 px-2">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-black/10 rounded-full animate-ping"></div>
                                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center relative z-10 border-2 border-white shadow-sm">
                                        <Navigation className="w-5 h-5 text-black animate-pulse" />
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 tracking-tight">Finding rides...</h2>
                                    <p className="text-gray-500 text-sm font-medium">You're in a busy area.</p>
                                </div>
                            </div>
                            
                            <button 
                                onClick={handleOnlineMode}
                                className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
                            >
                                <Power className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between py-2 px-2">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center shadow-inner border border-gray-100">
                                    <Power className="w-5 h-5 text-gray-300" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 tracking-tight">You're offline</h2>
                                    <p className="text-gray-500 text-sm font-medium">Tap to start receiving requests.</p>
                                </div>
                            </div>

                            <button
                                onClick={handleOnlineMode}
                                className="bg-black text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-gray-900 shadow-md active:scale-95 transition-all cursor-pointer"
                            >
                                GO
                            </button>
                        </div>
                    )}
                </div>

                {/* Ride Offer Modal */}
                <RideOfferModal
                    isOpen={showOffer}
                    offer={rideOffer}
                    onAccept={handleAccept}
                    onDecline={handleDecline}
                />
            </div>
        </>
    );
}
