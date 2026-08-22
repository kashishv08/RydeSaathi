import React, { useEffect, useState } from 'react';
import { MapPin, Navigation, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RideOfferModal({ isOpen, offer, onAccept, onDecline }) {
    const [timeLeft, setTimeLeft] = useState(15);

    useEffect(() => {
        if (!isOpen) {
            setTimeLeft(15);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onDecline(); // Auto-decline when time runs out
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isOpen, onDecline]);

    if (!offer) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black z-40"
                    />

                    {/* Modal */}
                    <motion.div 
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 overflow-hidden"
                    >
                        {/* Progress Bar Timer */}
                        <div className="w-full h-1.5 bg-gray-100">
                            <motion.div 
                                className="h-full bg-black"
                                initial={{ width: "100%" }}
                                animate={{ width: "0%" }}
                                transition={{ duration: 15, ease: "linear" }}
                            />
                        </div>

                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-3xl font-bold text-black">₹ {offer.amount}</h2>
                                    <div className="flex items-center gap-2 text-gray-500 font-medium mt-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{offer.duration_min} min</span>
                                        <span>•</span>
                                        <span>{offer.distance_km} km</span>
                                    </div>
                                </div>
                                <div className="bg-black text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">
                                    {timeLeft}
                                </div>
                            </div>

                            {/* Route Info */}
                            <div className="relative pl-6 mb-8">
                                <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gray-300"></div>
                                
                                <div className="relative mb-6">
                                    <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 bg-black rounded-full border-2 border-white"></div>
                                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Pickup</h3>
                                    <p className="text-lg font-semibold text-black leading-tight">{offer.pickup_address}</p>
                                </div>

                                <div className="relative">
                                    <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 bg-white border-[3px] border-black rounded-sm"></div>
                                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Drop-off</h3>
                                    <p className="text-lg font-semibold text-black leading-tight">{offer.drop_address}</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <button 
                                    onClick={onDecline}
                                    className="flex-1 py-4 rounded-xl bg-gray-100 text-black font-bold text-lg hover:bg-gray-200 transition-colors"
                                >
                                    Decline
                                </button>
                                <button 
                                    onClick={onAccept}
                                    className="flex-[2] py-4 rounded-xl bg-black text-white font-bold text-lg hover:bg-gray-800 transition-colors shadow-xl"
                                >
                                    Tap to Accept
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
