import { AnimatePresence, motion } from 'framer-motion';
import { Clock, Navigation, Navigation2, Wallet, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function RideOfferModal({ isOpen, offer, onAccept, onDecline }) {
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        if (!isOpen || !offer) {
            return;
        }

        // Initialize local timer
        let currentTimer = offer.timeout;
        setTimeLeft(currentTimer);

        const timerId = setInterval(() => {
            currentTimer -= 1;
            setTimeLeft(currentTimer);

            if (currentTimer <= 0) {
                clearInterval(timerId);
                onDecline();
            }
        }, 1000);

        return () => clearInterval(timerId);
    }, [isOpen, offer, onDecline]);

    if (!offer || !offer.pickup_address) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="modal-container"
                    className="absolute inset-0 z-40 pointer-events-none"
                >
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black pointer-events-auto"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ y: "100%", opacity: 0, scale: 0.95 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: "100%", opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="absolute bottom-4 left-4 right-4 bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] overflow-hidden pointer-events-auto border border-gray-100/50 backdrop-blur-xl"
                    >
                        {/* Progress Line */}
                        <div className="w-full h-1.5 bg-gray-100">
                            <motion.div
                                className="h-full bg-black shadow-[0_0_12px_rgba(0,0,0,0.8)] rounded-r-full"
                                initial={{ width: "100%" }}
                                animate={{ width: "0%" }}
                                transition={{ duration: offer.timeout || 15, ease: "linear" }}
                            />
                        </div>

                        <div className="p-6">
                            {/* Header: Title & Timer */}
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
                                    <span className="text-xs font-semibold tracking-wider uppercase text-gray-500">New Request</span>
                                </div>
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-bold text-sm">
                                    {timeLeft}
                                </div>
                            </div>

                            {/* Fare & Stats */}
                            <div className="mb-5">
                                <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-3">
                                    ₹{offer.amount}
                                </h2>
                                
                                <div className="flex flex-wrap gap-2">
                                    <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-md">
                                        <Clock className="w-3.5 h-3.5 text-gray-500" />
                                        <span className="text-xs font-semibold text-gray-700">{offer.duration_min} min</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-md">
                                        <Navigation className="w-3.5 h-3.5 text-gray-500" />
                                        <span className="text-xs font-semibold text-gray-700">{offer.distance_km} km</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-md">
                                        <Wallet className="w-3.5 h-3.5 text-gray-500" />
                                        <span className="text-xs font-semibold text-gray-700">Cash</span>
                                    </div>
                                </div>
                            </div>

                            {/* Route Info Card */}
                            <div className="mb-6">
                                <div className="flex gap-3 relative">
                                    {/* Timeline graphic */}
                                    <div className="flex flex-col items-center mt-1">
                                        <div className="w-2 h-2 rounded-full bg-black shrink-0"></div>
                                        <div className="w-[1.5px] h-8 bg-gray-200 my-1"></div>
                                        <div className="w-2 h-2 rounded-sm bg-black shrink-0"></div>
                                    </div>

                                    <div className="flex-1 flex flex-col justify-between py-0.5 space-y-4">
                                        <div>
                                            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Pickup</p>
                                            <p className="text-sm font-medium text-gray-900 leading-snug line-clamp-2">{offer.pickup_address}</p>
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Drop-off</p>
                                            <p className="text-sm font-medium text-gray-900 leading-snug line-clamp-2">{offer.drop_address}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <button
                                    onClick={onDecline}
                                    className="w-14 h-12 shrink-0 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 active:scale-95 transition-all cursor-pointer"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={onAccept}
                                    className="flex-1 h-12 rounded-xl bg-black text-white font-semibold text-base hover:bg-gray-900 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
                                >
                                    <span>Accept Ride</span>
                                    <Navigation2 className="w-4 h-4 text-white transform rotate-90" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
