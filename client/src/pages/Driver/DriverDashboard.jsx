import { toast } from '@heroui/react';
import { Menu, Navigation, Power } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RideOfferModal from '../../components/driver/RideOfferModal';
import Navbar from '../../components/shared/layout/Navbar';
import { useDriverPing, useDriverToggle } from '../../hooks/driver';
import { useRideAcceptDriver } from '../../hooks/rider';
import { useDriverLocationPing } from '../../hooks/useDriverLocationPing';
import LocationSender from '../../utils/currentLocationHelper';

export default function DriverDashboard() {
    const [isOnline, setIsOnline] = useState(false);
    const [showOffer, setShowOffer] = useState(false);
    const [rideOffer, setRideOffer] = useState({});
    const navigate = useNavigate();

    const { mutate: driverToggle } = useDriverToggle();
    const { mutate: driverLoc, data: driverData } = useDriverPing();
    const { mutate: rideAccept } = useRideAcceptDriver();
    console.log(driverData);

    async function handleOnlineMode() {
        if (!isOnline) {
            const location = await LocationSender();
            if (!location) return;
            console.log(location)
            if (location?.loc) {
                const data = {
                    "lat": location.loc.lat,
                    "lng": location.loc.lng
                }
                driverToggle({ online: true });
                driverLoc(data);
                setIsOnline(true);
            }
            if (location.error) {
                toast.error(location.error);
            }
        } else {
            driverToggle({ online: false });
            setIsOnline(false);
        }
    }

    useDriverLocationPing(isOnline);

    useEffect(() => {
        const wb = () => {
            if (driverData?.data.driver_id) {
                const socket = new WebSocket(`ws://localhost:8000/ws/driver/${driverData?.data.driver_id}/`)
                socket.onmessage = (event) => {
                    const msg = JSON.parse(event.data);
                    console.log(msg);

                    if (msg.type === 'ride_offer') {
                        setShowOffer(true);
                        setRideOffer({
                            pickup_address: msg.pickup_address,
                            drop_address: msg.drop_address,
                            distance_km: msg.route_distance_km,
                            duration_min: msg.route_duration_min,
                            amount: msg.amount,
                            timeout: msg.timeout,
                            ride_id: msg.ride_id
                        });
                    }
                }
            }
        }
        wb();
    }, [isOnline, driverData])

    const handleAccept = () => {
        setShowOffer(false);
        rideAccept(rideOffer.ride_id)
        navigate('/driver/active', { state: { ride_id: rideOffer.ride_id } });
    };

    const handleDecline = () => {
        setShowOffer(false);
    };

    return (
        <>
            <Navbar />
            <div className="h-screen w-full flex flex-col bg-gray-50 relative overflow-hidden">
                {/* Top Navigation / Status Bar */}
                <div className="absolute top-0 left-0 right-0 z-20 p-4 pt-6 flex justify-between items-center pointer-events-none">
                    <button className="bg-white p-3 rounded-full shadow-lg pointer-events-auto" onClick={() => navigate('/driver/profile')}>
                        <Menu className="w-6 h-6 text-black" />
                    </button>

                    <div className="pointer-events-auto">
                        <div className="bg-white rounded-full p-1 pl-4 pr-1 flex items-center gap-3 shadow-lg cursor-pointer" onClick={handleOnlineMode}>
                            <span className={`text-sm font-semibold ${isOnline ? 'text-black' : 'text-gray-500'}`}>
                                {isOnline ? 'Online' : 'Offline'}
                            </span>
                            <div className={`p-2 rounded-full transition-colors ${isOnline ? 'bg-black' : 'bg-gray-200'}`}>
                                <Power className={`w-5 h-5 ${isOnline ? 'text-white' : 'text-gray-500'}`} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-2 px-4 rounded-full shadow-lg pointer-events-auto font-bold text-lg">
                        ₹ 1,250
                    </div>
                </div>

                {/* Map Area (Dummy Background for now) */}
                <div className="flex-1 bg-gray-200 relative">
                    {/* Simulated Map Background */}
                    <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>

                    {/* Center Map Pin */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                        <div className="bg-black text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg mb-1 whitespace-nowrap">
                            You are here
                        </div>
                        <Navigation className="w-10 h-10 text-black fill-black -mt-1 transform rotate-45" />
                    </div>
                </div>

                {/* Bottom Status Sheet */}
                <div className="bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-6 z-20 relative">
                    <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>

                    {isOnline ? (
                        <div className="flex flex-col items-center justify-center py-6">
                            <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
                            <h2 className="text-2xl font-bold text-black">Finding rides...</h2>
                            <p className="text-gray-500 mt-2">You're in a busy area.</p>

                            {/* DEBUG BUTTON */}
                            <button onClick={() => setShowOffer(true)} className="mt-8 text-xs underline text-gray-400">
                                Simulate Ride Offer
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-6">
                            <div className="bg-gray-100 p-4 rounded-full mb-4">
                                <Power className="w-8 h-8 text-gray-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-black">You're offline</h2>
                            <p className="text-gray-500 mt-2">Go online to start receiving ride requests.</p>
                            <button
                                onClick={handleOnlineMode}
                                className="w-full max-w-sm bg-black text-white font-bold py-4 rounded-xl mt-8 text-lg hover:bg-gray-800 transition-colors"
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
