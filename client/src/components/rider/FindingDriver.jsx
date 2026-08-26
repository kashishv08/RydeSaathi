import { motion } from 'framer-motion';
import {
    Banknote,
    MapPin,
    Navigation,
    X,
} from 'lucide-react';
import { CancelRideModal } from './CancelRideModal';

const PRIMARY = 'var(--clr-primary)';
const ACCENT = 'var(--clr-accent)';
const FG = 'var(--clr-foreground)';
const MUTED = 'var(--clr-muted)';
const CARD_BG = 'var(--clr-card)';
const BORDER = 'var(--clr-border)';

// ── Sonar scanner ring ───────────────────────────────────────────────────────
const ScanRing = ({ delay = 0, size = 56 }) => (
    <motion.div
        className="absolute rounded-full"
        style={{
            width: size,
            height: size,
            border: `1px solid color-mix(in srgb, var(--clr-primary) 40%, transparent)`,
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
                    background: 'color-mix(in srgb, var(--clr-primary) 6%, transparent)',
                    border: '1px solid color-mix(in srgb, var(--clr-primary) 15%, transparent)',
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
                            background: 'color-mix(in srgb, var(--clr-primary) 10%, transparent)',
                            border: `1px solid color-mix(in srgb, var(--clr-primary) 30%, transparent)`,
                        }}
                        animate={{ boxShadow: ['0 0 0px color-mix(in srgb, var(--clr-primary) 0%, transparent)', '0 0 18px color-mix(in srgb, var(--clr-primary) 30%, transparent)', '0 0 0px color-mix(in srgb, var(--clr-primary) 0%, transparent)'] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
                        >
                            <Navigation className="w-6 h-6" style={{ color: PRIMARY }} />
                        </motion.div>
                    </motion.div>
                </div>

                <div>
                    <h2 className="text-xl font-black tracking-tight mb-0.5" style={{ color: FG }}>
                        {statusText || 'Ride requested'}
                    </h2>
                    <motion.p
                        key={subText}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="text-sm font-medium"
                        style={{ color: MUTED }}
                    >
                        {subText || 'Finding drivers nearby…'}
                    </motion.p>
                </div>

                {/* Shimmer progress bar */}
                <div
                    className="w-full h-1 rounded-full overflow-hidden relative"
                    style={{ background: 'hsl(38,24%,90%)' }}
                >
                    <motion.div
                        className="absolute top-0 bottom-0 rounded-full"
                        style={{
                            width: '38%',
                            background: `linear-gradient(90deg, transparent, hsl(169,59%,45%,0.8), ${PRIMARY}, hsl(169,59%,45%,0.8), transparent)`,
                        }}
                        animate={{ left: ['-38%', '110%'] }}
                        transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
                    />
                </div>
            </div>

            {/* ── Route Card ───────────────────────────────────────────── */}
            <div
                className="rounded-2xl p-4"
                style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}
            >
                <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: MUTED }}>Route</p>
                <div className="relative pl-7 space-y-5">
                    {/* Gradient connector line */}
                    <div
                        className="absolute left-[9px] top-[20px] bottom-[20px] w-[2px] rounded-full"
                        style={{ background: `linear-gradient(to bottom, ${PRIMARY}, ${ACCENT})` }}
                    />

                    {/* Pickup */}
                    <div className="relative flex items-center gap-3">
                        <div
                            className="absolute -left-[27px] w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ background: 'color-mix(in srgb, var(--clr-primary) 15%, transparent)', border: `1px solid color-mix(in srgb, var(--clr-primary) 35%, transparent)` }}
                        >
                            <div className="w-2 h-2 rounded-full" style={{ background: PRIMARY }} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <span className="text-[9px] font-bold uppercase tracking-wider block mb-0.5" style={{ color: MUTED }}>Pickup</span>
                            <p className="text-sm font-semibold truncate" style={{ color: FG }}>
                                {pickup || 'Pickup Location'}
                            </p>
                        </div>
                    </div>

                    {/* Dropoff */}
                    <div className="relative flex items-center gap-3">
                        <div
                            className="absolute -left-[27px] w-5 h-5 rounded-md flex items-center justify-center"
                            style={{ background: 'color-mix(in srgb, var(--clr-accent) 15%, transparent)', border: `1px solid color-mix(in srgb, var(--clr-accent) 30%, transparent)` }}
                        >
                            <MapPin className="w-3 h-3" style={{ color: ACCENT }} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <span className="text-[9px] font-bold uppercase tracking-wider block mb-0.5" style={{ color: MUTED }}>Dropoff</span>
                            <p className="text-sm font-semibold truncate" style={{ color: FG }}>
                                {drop || 'Dropoff Location'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Fare Card ────────────────────────────────────────────── */}
            <div
                className="rounded-2xl px-4 py-3.5 flex items-center justify-between"
                style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}
            >
                <div className="flex items-center gap-3">
                    <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: 'color-mix(in srgb, var(--clr-primary) 10%, transparent)', border: `1px solid color-mix(in srgb, var(--clr-primary) 20%, transparent)` }}
                    >
                        <Banknote className="w-4 h-4" style={{ color: PRIMARY }} />
                    </div>
                    <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: MUTED }}>Payment</p>
                        <p className="text-sm font-bold" style={{ color: FG }}>Cash</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: MUTED }}>Est. Fare</p>
                    <p className="text-xl font-black tracking-tight" style={{ color: FG }}>
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
                        background: 'color-mix(in srgb, var(--clr-destructive) 7%, transparent)',
                        border: '1px solid color-mix(in srgb, var(--clr-destructive) 25%, transparent)',
                        color: 'var(--clr-destructive)',
                    }}
                >
                    <X className="w-4 h-4" />
                    Cancel Ride Request
                </motion.button>
            </CancelRideModal>
        </motion.div>
    );
}