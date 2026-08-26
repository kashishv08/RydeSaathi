import { motion } from 'framer-motion';
import { Banknote, MapPin, MessageSquare, Phone, Star, X } from 'lucide-react';
import { useRideDetails } from '../../hooks/rider';
import { CancelRideModal } from './CancelRideModal';

const PRIMARY = 'var(--clr-primary)';
const ACCENT = 'var(--clr-accent)';
const FG = 'var(--clr-foreground)';
const MUTED = 'var(--clr-muted)';
const CARD_BG = 'var(--clr-card)';
const BORDER = 'var(--clr-border)';

// ── Reusable light card wrapper ────────────────────────────────────────────
const GlassCard = ({ children, className = '' }) => (
    <div
        className={`rounded-2xl p-4 ${className}`}
        style={{
            background: CARD_BG,
            border: `1px solid ${BORDER}`,
        }}
    >
        {children}
    </div>
);

export default function DriverArriving({ onCancel, isInProgress = false, pickupEtaMins, destEtaMins }) {
    const { data: rideDetail } = useRideDetails();
    const ride = rideDetail?.data;
    const otpArray = String(ride?.ride_otp || '----').split('');

    const fallbackDestEta = ride?.route_duration_min ? Math.ceil(ride.route_duration_min) : null;
    const finalDestEta = destEtaMins || fallbackDestEta;

    const pickupText = pickupEtaMins
        ? `Pickup in ${pickupEtaMins} min${pickupEtaMins > 1 ? 's' : ''}`
        : 'Driver arriving soon';
    const dropoffText = finalDestEta
        ? `Drop-off in ${finalDestEta} min${finalDestEta > 1 ? 's' : ''}`
        : 'Heading to destination';

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.32, ease: 'easeOut' }}
            className="flex flex-col gap-4 overflow-y-auto custom-scrollbar"
        >
            {/* ── ETA Header ─────────────────────────────────────────────── */}
            <div
                className="rounded-2xl px-4 py-4 text-center"
                style={{
                    background: isInProgress
                        ? 'color-mix(in srgb, var(--clr-accent) 15%, transparent)'
                        : 'var(--clr-primary-subtle)',
                    border: `1px solid ${isInProgress ? 'color-mix(in srgb, var(--clr-accent) 30%, transparent)' : 'color-mix(in srgb, var(--clr-primary) 20%, transparent)'}`,
                }}
            >
                <motion.h2
                    key={isInProgress ? 'inprogress' : 'arriving'}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xl font-black tracking-tight"
                    style={{ color: FG }}
                >
                    {isInProgress ? dropoffText : pickupText}
                </motion.h2>
            </div>

            {/* ── OTP Section (only when waiting for pickup) ─────────────── */}
            {!isInProgress && (
                <GlassCard>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: MUTED }}>Ride OTP</p>
                            <p className="text-xs" style={{ color: MUTED }}>Share this PIN with your driver</p>
                        </div>
                        <div className="flex gap-2">
                            {otpArray.map((digit, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: i * 0.07, type: 'spring', stiffness: 280, damping: 18 }}
                                    className="w-9 h-10 rounded-xl flex items-center justify-center font-black text-lg"
                                    style={{
                                        background: 'hsl(169,59%,31%,0.1)',
                                        border: '1.5px solid hsl(169,59%,31%,0.35)',
                                        color: PRIMARY,
                                        boxShadow: '0 2px 12px hsl(169,59%,31%,0.15)',
                                    }}
                                >
                                    {digit}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </GlassCard>
            )}

            {/* ── Driver Info ─────────────────────────────────────────────── */}
            <GlassCard>
                <div className="flex items-center justify-between mb-4">
                    {/* Avatar + name */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="relative">
                            <div
                                className="w-14 h-14 rounded-full overflow-hidden"
                                style={{ border: `2px solid color-mix(in srgb, var(--clr-primary) 35%, transparent)` }}
                            >
                                <img
                                    src="https://i.pravatar.cc/150?img=11"
                                    alt="Driver"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* Star badge */}
                            <div
                                className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full flex items-center gap-0.5 whitespace-nowrap"
                                style={{
                                    background: CARD_BG,
                                    border: `1px solid ${BORDER}`,
                                    boxShadow: '0 2px 8px rgba(27,54,58,0.1)',
                                }}
                            >
                                <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                                <span className="text-[10px] font-bold" style={{ color: FG }}>
                                    {ride?.driver_details?.rating || '5.0'}
                                </span>
                            </div>
                        </div>
                        <span className="text-sm font-bold" style={{ color: FG }}>
                            {ride?.driver_details?.name || 'Driver'}
                        </span>
                    </div>

                    {/* Car image */}
                    <div className="flex-1 flex justify-center">
                        <img
                            src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1597151213/assets/67/034ebc-270f-4889-bc86-bc16e91122a2/original/UberXL.png"
                            alt="Car"
                            className="w-28 h-16 object-contain"
                            style={{ filter: `drop-shadow(0 0 8px color-mix(in srgb, var(--clr-primary) 20%, transparent))` }}
                        />
                    </div>

                    {/* Plate + type */}
                    <div className="text-right">
                        <div
                            className="px-2.5 py-1 rounded-lg font-black text-sm tracking-wider mb-1"
                            style={{
                                background: 'var(--clr-border)',
                                border: `1px solid ${BORDER}`,
                                color: FG,
                            }}
                        >
                            {ride?.driver_details?.plate_number || 'UP 16 AB 1234'}
                        </div>
                        <p className="text-xs" style={{ color: MUTED }}>
                            {ride?.driver_details?.vehicle_type || 'Vehicle'}
                        </p>
                    </div>
                </div>

                {/* Message / Call buttons */}
                <div className="flex gap-2">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex-1 flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
                        style={{
                            background: 'var(--clr-border)',
                            border: `1px solid ${BORDER}`,
                            color: MUTED,
                        }}
                    >
                        <MessageSquare className="w-4 h-4" style={{ color: PRIMARY }} />
                        Send a message…
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-11 h-11 flex items-center justify-center rounded-xl transition-all shrink-0"
                        style={{
                            background: 'color-mix(in srgb, var(--clr-primary) 10%, transparent)',
                            border: `1px solid color-mix(in srgb, var(--clr-primary) 22%, transparent)`,
                        }}
                    >
                        <Phone className="w-4 h-4" style={{ color: PRIMARY }} />
                    </motion.button>
                </div>
            </GlassCard>

            {/* ── Route Details ───────────────────────────────────────────── */}
            <GlassCard>
                <p className="text-[9px] font-bold uppercase tracking-widest mb-3" style={{ color: MUTED }}>Route</p>
                <div className="relative pl-7 space-y-4">
                    {/* Gradient connector */}
                    <div
                        className="absolute left-[9px] top-[18px] bottom-[18px] w-[2px] rounded-full"
                        style={{ background: `linear-gradient(to bottom, ${PRIMARY}, ${ACCENT})` }}
                    />

                    {/* Pickup */}
                    <div className="relative flex items-start gap-2 justify-between">
                        <div
                            className="absolute -left-[27px] w-[18px] h-[18px] rounded-full flex items-center justify-center mt-0.5"
                            style={{ background: 'color-mix(in srgb, var(--clr-primary) 15%, transparent)', border: `1px solid color-mix(in srgb, var(--clr-primary) 35%, transparent)` }}
                        >
                            <div className="w-2 h-2 rounded-full" style={{ background: PRIMARY }} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color: MUTED }}>Pickup</p>
                            <p className="text-sm font-semibold truncate" style={{ color: FG }}>
                                {ride?.pickup_address || 'Pickup Location'}
                            </p>
                        </div>
                    </div>

                    {/* Dropoff */}
                    <div className="relative flex items-start gap-2 justify-between">
                        <div
                            className="absolute -left-[27px] w-[18px] h-[18px] rounded-md flex items-center justify-center mt-0.5"
                            style={{ background: 'color-mix(in srgb, var(--clr-accent) 15%, transparent)', border: `1px solid color-mix(in srgb, var(--clr-accent) 30%, transparent)` }}
                        >
                            <MapPin className="w-2.5 h-2.5" style={{ color: ACCENT }} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color: MUTED }}>Dropoff</p>
                            <p className="text-sm font-semibold truncate" style={{ color: FG }}>
                                {ride?.drop_address || 'Dropoff Location'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Fare row */}
                <div
                    className="flex items-center justify-between mt-4 pt-3"
                    style={{ borderTop: `1px solid ${BORDER}` }}
                >
                    <div className="flex items-center gap-2">
                        <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center"
                            style={{ background: 'hsl(169,59%,31%,0.1)', border: `1px solid color-mix(in srgb, var(--clr-primary) 20%, transparent)` }}
                        >
                            <Banknote className="w-4 h-4" style={{ color: PRIMARY }} />
                        </div>
                        <div>
                            <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: MUTED }}>Payment</p>
                            <p className="text-xs font-bold" style={{ color: FG }}>Cash</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: MUTED }}>Fare</p>
                        <p className="text-lg font-black" style={{ color: FG }}>₹{ride?.amount || '—'}</p>
                    </div>
                </div>
            </GlassCard>

            {/* ── Cancel Button ────────────────────────────────────────────── */}
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
                    Cancel Ride
                </motion.button>
            </CancelRideModal>
        </motion.div>
    );
}
