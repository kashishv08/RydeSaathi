import { AnimatePresence, motion } from 'framer-motion';
import { Clock, Navigation, Navigation2, Wallet, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const PRIMARY = 'hsl(169, 59%, 31%)';
const ACCENT = 'hsl(14, 83%, 62%)';
const FG = 'hsl(193, 43%, 15%)';
const MUTED = 'hsl(193, 15%, 45%)';
const CARD_BG = 'hsl(44, 44%, 99%)';
const BORDER = 'hsl(38, 24%, 86%)';
const BG_DARK = 'hsl(193, 43%, 15%)';

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
                        style={{ background: 'rgba(27,54,58,0.55)', backdropFilter: 'blur(8px)' }}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ y: "100%", opacity: 0, scale: 0.95 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: "100%", opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="absolute bottom-4 left-4 right-4 rounded-3xl overflow-hidden pointer-events-auto shadow-2xl"
                        style={{
                            background: CARD_BG,
                            border: `1px solid color-mix(in srgb, var(--clr-primary) 20%, transparent)`,
                            boxShadow: '0 20px 60px rgba(27,54,58,0.2), 0 0 40px var(--clr-primary-subtle)',
                        }}
                    >
                        {/* Progress Line */}
                        <div className="w-full h-1.5" style={{ background: 'var(--clr-border)' }}>
                            <motion.div
                                className="h-full rounded-r-full"
                                style={{
                                    background: `linear-gradient(90deg, ${PRIMARY}, ${ACCENT})`,
                                    boxShadow: `0 0 12px hsl(169,59%,31%,0.5)`,
                                }}
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
                                        <div className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ background: PRIMARY }}></div>
                                        <div className="w-2.5 h-2.5 rounded-full relative z-10" style={{ background: PRIMARY, boxShadow: `0 0 8px hsl(169,59%,31%,0.7)` }}></div>
                                    </div>
                                    <span className="text-xs font-bold tracking-widest uppercase" style={{ color: PRIMARY }}>New Request</span>
                                </div>
                                <div className="flex items-center justify-center w-9 h-9 rounded-full font-bold text-sm border"
                                    style={{
                                        background: 'var(--clr-primary-subtle)',
                                        borderColor: 'hsl(169,59%,31%,0.25)',
                                        color: FG,
                                        boxShadow: '0 0 15px hsl(169,59%,31%,0.1)',
                                    }}
                                >
                                    {timeLeft}
                                </div>
                            </div>

                            {/* Fare & Stats */}
                            <div className="mb-6">
                                <h2 className="text-4xl font-black tracking-tight mb-4" style={{ color: FG, fontFamily: "'Manrope', sans-serif" }}>
                                    ₹{offer.amount}
                                </h2>
                                
                                <div className="flex flex-wrap gap-2.5">
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border"
                                        style={{ background: 'hsl(38,24%,96%)', borderColor: BORDER }}
                                    >
                                        <Clock className="w-4 h-4" style={{ color: PRIMARY }} />
                                        <span className="text-xs font-bold" style={{ color: FG }}>{offer.duration_min} min</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border"
                                        style={{ background: 'hsl(38,24%,96%)', borderColor: BORDER }}
                                    >
                                        <Navigation className="w-4 h-4" style={{ color: ACCENT }} />
                                        <span className="text-xs font-bold" style={{ color: FG }}>{offer.distance_km} km</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border"
                                        style={{ background: 'hsl(38,24%,96%)', borderColor: BORDER }}
                                    >
                                        <Wallet className="w-4 h-4" style={{ color: 'hsl(39,66%,50%)' }} />
                                        <span className="text-xs font-bold" style={{ color: FG }}>Cash</span>
                                    </div>
                                </div>
                            </div>

                            {/* Route Info Card */}
                            <div className="mb-6 p-4 rounded-2xl border"
                                style={{ background: 'hsl(43,38%,97%)', borderColor: BORDER }}
                            >
                                <div className="flex gap-3 relative">
                                    <div className="flex flex-col items-center mt-1">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: PRIMARY, boxShadow: `0 0 8px hsl(169,59%,31%,0.5)` }}></div>
                                        <div className="w-[2px] h-8 my-1" style={{ background: `linear-gradient(to bottom, ${PRIMARY}, ${ACCENT})` }}></div>
                                        <div className="w-2.5 h-2.5 rounded-sm" style={{ background: ACCENT, boxShadow: `0 0 8px hsl(14,83%,62%,0.5)` }}></div>
                                    </div>

                                    <div className="flex-1 flex flex-col justify-between py-0.5 space-y-4">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: MUTED }}>Pickup</p>
                                            <p className="text-sm font-semibold leading-snug line-clamp-2" style={{ color: FG }}>{offer.pickup_address}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: MUTED }}>Drop-off</p>
                                            <p className="text-sm font-semibold leading-snug line-clamp-2" style={{ color: FG }}>{offer.drop_address}</p>
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
                                        background: 'hsl(1,72%,52%,0.08)',
                                        borderColor: 'hsl(1,72%,52%,0.2)',
                                        color: 'hsl(1,72%,45%)',
                                    }}
                                >
                                    <X className="w-6 h-6" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onAccept}
                                    className="flex-1 h-14 rounded-2xl font-bold text-base transition-all cursor-pointer flex items-center justify-center gap-2 border"
                                    style={{
                                        background: `linear-gradient(135deg, ${PRIMARY}, hsl(169,59%,20%))`,
                                        borderColor: 'hsl(169,59%,31%,0.5)',
                                        boxShadow: '0 6px 20px hsl(169,59%,31%,0.3)',
                                        color: 'var(--clr-card)',
                                    }}
                                >
                                    <span>Accept Ride</span>
                                    <Navigation2 className="w-5 h-5 transform rotate-90" />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
