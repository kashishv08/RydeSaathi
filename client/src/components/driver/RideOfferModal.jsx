import { AnimatePresence, motion } from 'framer-motion';
import { Clock, Navigation, Navigation2, Wallet, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function RideOfferModal({ isOpen, offer, onAccept, onDecline }) {
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        if (!isOpen || !offer) {
            return;
        }

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
                    className="absolute inset-0 z-[100] pointer-events-none"
                >
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 pointer-events-auto"
                        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ y: "100%", opacity: 0, scale: 0.95 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: "100%", opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="absolute bottom-4 left-4 right-4 rounded-3xl overflow-hidden pointer-events-auto shadow-2xl"
                        style={{
                            background: 'linear-gradient(180deg,#1a1a2e 0%,#13131f 100%)',
                            border: '1px solid rgba(139,92,246,0.3)',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 40px rgba(139,92,246,0.1)'
                        }}
                    >
                        {/* Progress Line */}
                        <div className="w-full h-1.5" style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <motion.div
                                className="h-full rounded-r-full shadow-[0_0_12px_rgba(139,92,246,0.8)]"
                                style={{ background: 'linear-gradient(90deg, #7c3aed, #10b981)' }}
                                initial={{ width: "100%" }}
                                animate={{ width: "0%" }}
                                transition={{ duration: offer.timeout || 15, ease: "linear" }}
                            />
                        </div>

                        <div className="p-6">
                            {/* Header: Title & Timer */}
                            <div className="flex justify-between items-center mb-5">
                                <div className="flex items-center gap-2">
                                    <div className="relative flex items-center justify-center">
                                        <div className="absolute inset-0 bg-violet-500 rounded-full animate-ping opacity-40"></div>
                                        <div className="w-2.5 h-2.5 bg-violet-400 rounded-full relative z-10 shadow-[0_0_8px_rgba(139,92,246,0.8)]"></div>
                                    </div>
                                    <span className="text-xs font-bold tracking-widest uppercase text-violet-300">New Request</span>
                                </div>
                                <div className="flex items-center justify-center w-9 h-9 rounded-full font-bold text-sm border"
                                    style={{
                                        background: 'rgba(139,92,246,0.1)',
                                        borderColor: 'rgba(139,92,246,0.3)',
                                        color: '#fff',
                                        boxShadow: '0 0 15px rgba(139,92,246,0.2)'
                                    }}
                                >
                                    {timeLeft}
                                </div>
                            </div>

                            {/* Fare & Stats */}
                            <div className="mb-6">
                                <h2 className="text-4xl font-black text-white tracking-tight mb-4">
                                    ₹{offer.amount}
                                </h2>
                                
                                <div className="flex flex-wrap gap-2.5">
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border"
                                        style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
                                    >
                                        <Clock className="w-4 h-4 text-violet-400" />
                                        <span className="text-xs font-bold text-gray-300">{offer.duration_min} min</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border"
                                        style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
                                    >
                                        <Navigation className="w-4 h-4 text-emerald-400" />
                                        <span className="text-xs font-bold text-gray-300">{offer.distance_km} km</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border"
                                        style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
                                    >
                                        <Wallet className="w-4 h-4 text-blue-400" />
                                        <span className="text-xs font-bold text-gray-300">Cash</span>
                                    </div>
                                </div>
                            </div>

                            {/* Route Info Card */}
                            <div className="mb-6 p-4 rounded-2xl border"
                                style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}
                            >
                                <div className="flex gap-3 relative">
                                    <div className="flex flex-col items-center mt-1">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#8b5cf6', boxShadow: '0 0 8px rgba(139,92,246,0.6)' }}></div>
                                        <div className="w-[2px] h-8 my-1" style={{ background: 'linear-gradient(to bottom, #8b5cf6, #10b981)' }}></div>
                                        <div className="w-2.5 h-2.5 rounded-sm" style={{ background: '#10b981', boxShadow: '0 0 8px rgba(16,185,129,0.6)' }}></div>
                                    </div>

                                    <div className="flex-1 flex flex-col justify-between py-0.5 space-y-4">
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Pickup</p>
                                            <p className="text-sm font-semibold text-gray-200 leading-snug line-clamp-2">{offer.pickup_address}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Drop-off</p>
                                            <p className="text-sm font-semibold text-gray-200 leading-snug line-clamp-2">{offer.drop_address}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={onDecline}
                                    className="w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center transition-colors cursor-pointer border"
                                    style={{
                                        background: 'rgba(239,68,68,0.1)',
                                        borderColor: 'rgba(239,68,68,0.2)',
                                        color: '#f87171'
                                    }}
                                >
                                    <X className="w-6 h-6" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onAccept}
                                    className="flex-1 h-14 rounded-2xl text-white font-bold text-base transition-all cursor-pointer flex items-center justify-center gap-2 border"
                                    style={{
                                        background: 'linear-gradient(135deg,#7c3aed,#5b21b6)',
                                        borderColor: 'rgba(139,92,246,0.5)',
                                        boxShadow: '0 6px 20px rgba(124,58,237,0.4)'
                                    }}
                                >
                                    <span>Accept Ride</span>
                                    <Navigation2 className="w-5 h-5 text-white transform rotate-90" />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
