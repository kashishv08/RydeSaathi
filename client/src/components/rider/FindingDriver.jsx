import { motion } from 'framer-motion';
import {
    Banknote,
    MapPin,
    Navigation,
    X,
} from 'lucide-react';
import { CancelRideModal } from './CancelRideModal';

// ── Sonar scanner ring ───────────────────────────────────────────────────────
const ScanRing = ({ delay = 0, size = 56 }) => (
    <motion.div
        className="absolute rounded-full"
        style={{
            width: size,
            height: size,
            border: '1px solid rgba(139,92,246,0.45)',
        }}
        initial={{ scale: 0.6, opacity: 0.8 }}
        animate={{ scale: 2.2, opacity: 0 }}
        transition={{ duration: 2, delay, repeat: Infinity, ease: 'easeOut' }}
    />
);

export default function FindingDriver({ pickup, drop, fare, statusText, subText, onCancel }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.32, ease: 'easeOut' }}
            className="flex flex-col gap-5 overflow-y-auto custom-scrollbar"
        >
            {/* ── Scanner Icon + Title ─────────────────────────────────── */}
            <div
                className="rounded-2xl px-5 py-6 flex flex-col items-center text-center gap-3"
                style={{
                    background: 'linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(91,33,182,0.04) 100%)',
                    border: '1px solid rgba(139,92,246,0.16)',
                }}
            >
                {/* Animated scanner */}
                <div className="relative flex items-center justify-center w-14 h-14 mb-1">
                    <ScanRing delay={0} size={56} />
                    <ScanRing delay={0.75} size={56} />
                    <ScanRing delay={1.5} size={56} />
                    <motion.div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center relative z-10"
                        style={{
                            background: 'rgba(139,92,246,0.14)',
                            border: '1px solid rgba(139,92,246,0.3)',
                        }}
                        animate={{ boxShadow: ['0 0 0px rgba(139,92,246,0)', '0 0 18px rgba(139,92,246,0.35)', '0 0 0px rgba(139,92,246,0)'] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
                        >
                            <Navigation className="w-6 h-6 text-violet-400" />
                        </motion.div>
                    </motion.div>
                </div>

                <div>
                    <h2 className="text-xl font-black text-white tracking-tight mb-0.5">
                        {statusText || 'Ride requested'}
                    </h2>
                    <motion.p
                        key={subText}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="text-sm text-gray-400 font-medium"
                    >
                        {subText || 'Finding drivers nearby…'}
                    </motion.p>
                </div>

                {/* Shimmer progress bar */}
                <div
                    className="w-full h-1 rounded-full overflow-hidden relative"
                    style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                    <motion.div
                        className="absolute top-0 bottom-0 rounded-full"
                        style={{
                            width: '38%',
                            background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.8), rgba(167,139,250,1), rgba(139,92,246,0.8), transparent)',
                        }}
                        animate={{ left: ['-38%', '110%'] }}
                        transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
                    />
                </div>
            </div>

            {/* ── Route Card ───────────────────────────────────────────── */}
            <div
                className="rounded-2xl p-4"
                style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                }}
            >
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-3">Route</p>
                <div className="relative pl-7 space-y-5">
                    {/* Gradient connector line */}
                    <div
                        className="absolute left-[9px] top-[20px] bottom-[20px] w-[2px] rounded-full"
                        style={{ background: 'linear-gradient(to bottom, rgba(139,92,246,0.7), rgba(16,185,129,0.7))' }}
                    />

                    {/* Pickup */}
                    <div className="relative flex items-center gap-3">
                        <div
                            className="absolute -left-[27px] w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.4)' }}
                        >
                            <div className="w-2 h-2 rounded-full bg-violet-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <span className="text-[9px] font-bold text-gray-600 uppercase tracking-wider block mb-0.5">Pickup</span>
                            <p className="text-sm font-semibold text-gray-200 truncate">
                                {pickup || 'Pickup Location'}
                            </p>
                        </div>
                    </div>

                    {/* Dropoff */}
                    <div className="relative flex items-center gap-3">
                        <div
                            className="absolute -left-[27px] w-5 h-5 rounded-md flex items-center justify-center"
                            style={{ background: 'rgba(16,185,129,0.18)', border: '1px solid rgba(16,185,129,0.35)' }}
                        >
                            <MapPin className="w-3 h-3 text-emerald-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <span className="text-[9px] font-bold text-gray-600 uppercase tracking-wider block mb-0.5">Dropoff</span>
                            <p className="text-sm font-semibold text-gray-200 truncate">
                                {drop || 'Dropoff Location'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Fare Card ────────────────────────────────────────────── */}
            <div
                className="rounded-2xl px-4 py-3.5 flex items-center justify-between"
                style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                }}
            >
                <div className="flex items-center gap-3">
                    <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)' }}
                    >
                        <Banknote className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-gray-600">Payment</p>
                        <p className="text-sm font-bold text-gray-300">Cash</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-gray-600">Est. Fare</p>
                    <p className="text-xl font-black text-white tracking-tight">
                        ₹{fare ? Number(fare).toFixed(2) : '0.00'}
                    </p>
                </div>
            </div>

            {/* ── Cancel Button ────────────────────────────────────────── */}
            <CancelRideModal onConfirm={onCancel}>
                <motion.button
                    type="button"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full flex items-center justify-center gap-2 text-sm font-bold py-3.5 rounded-2xl transition-all"
                    style={{
                        background: 'rgba(239,68,68,0.08)',
                        border: '1px solid rgba(239,68,68,0.2)',
                        color: '#f87171',
                    }}
                >
                    <X className="w-4 h-4" />
                    Cancel Ride Request
                </motion.button>
            </CancelRideModal>
        </motion.div>
    );
}