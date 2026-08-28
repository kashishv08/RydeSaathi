import { useState } from 'react';
import { Avatar, ProgressBar } from "@heroui/react";
import {
    ArrowLeft, Bell, Car, Check, ChevronRight, Clock,
    CreditCard, Edit3, LogOut, MapPin, Save, Star, TrendingUp, X, Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logoutRequest } from '../../api/authApi';
import { useUserProfile } from '../../hooks/auth';
import { useRideDetails } from '../../hooks/rider';
import { motion, AnimatePresence } from 'framer-motion';
import { RIDE_STATUS } from '../../constants';

// ── Micro helpers ──────────────────────────────────────────────────────────────
function StatPill({ label, value, icon, accent }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border px-4 py-5 flex-1"
            style={{ background: 'var(--clr-card)', borderColor: 'var(--clr-border)' }}
        >
            <span className="flex items-center justify-center w-8 h-8 rounded-xl"
                style={{ background: `color-mix(in srgb, ${accent} 12%, transparent)` }}>
                {icon}
            </span>
            <span className="text-xl font-black font-mono leading-none" style={{ color: 'var(--clr-foreground)' }}>{value}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--clr-muted)' }}>{label}</span>
        </motion.div>
    );
}

function RideAreaChart({ data }) {
    const W = 320, H = 110, PAD = 14;
    const max = Math.max(...data.map(d => d.v), 1);
    const xs = data.map((_, i) => PAD + i * ((W - PAD * 2) / (data.length - 1)));
    const ys = data.map(d => PAD + (1 - d.v / max) * (H - PAD * 2));

    const linePath = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x},${ys[i]}`).join(' ');
    const areaPath = `${linePath} L${xs[xs.length - 1]},${H - PAD} L${xs[0]},${H - PAD} Z`;

    // smooth curve via catmull-rom approximation
    function smooth(pts) {
        if (pts.length < 2) return pts.map(([x, y]) => `${x},${y}`).join(' L');
        let d = `M${pts[0][0]},${pts[0][1]}`;
        for (let i = 0; i < pts.length - 1; i++) {
            const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
            const cx = (x0 + x1) / 2;
            d += ` C${cx},${y0} ${cx},${y1} ${x1},${y1}`;
        }
        return d;
    }
    const pts = xs.map((x, i) => [x, ys[i]]);
    const smoothLine = smooth(pts);
    const smoothArea = `${smoothLine} L${xs[xs.length - 1]},${H - PAD} L${xs[0]},${H - PAD} Z`;

    const [hovered, setHovered] = useState(null);
    const gradId = 'rideGrad';

    return (
        <div className="relative w-full select-none">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 110, overflow: 'visible' }}>
                <defs>
                    <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--clr-accent)" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="var(--clr-accent)" stopOpacity="0.01" />
                    </linearGradient>
                </defs>

                {/* Horizontal grid lines */}
                {[0.25, 0.5, 0.75, 1].map(f => (
                    <line key={f}
                        x1={PAD} y1={PAD + (1 - f) * (H - PAD * 2)}
                        x2={W - PAD} y2={PAD + (1 - f) * (H - PAD * 2)}
                        stroke="var(--clr-border)" strokeWidth="1" strokeDasharray="4 4" />
                ))}

                {/* Area fill */}
                <motion.path
                    d={smoothArea}
                    fill={`url(#${gradId})`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                />

                {/* Line */}
                <motion.path
                    d={smoothLine}
                    fill="none"
                    stroke="var(--clr-accent)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                />

                {/* Hit areas + dots */}
                {xs.map((x, i) => (
                    <g key={i}
                        onMouseEnter={() => setHovered(i)}
                        onMouseLeave={() => setHovered(null)}
                    >
                        <rect x={x - 14} y={PAD} width={28} height={H - PAD * 2} fill="transparent" />
                        <motion.circle
                            cx={x} cy={ys[i]} r={hovered === i ? 5 : 3.5}
                            fill={hovered === i ? 'var(--clr-accent)' : 'var(--clr-card)'}
                            stroke="var(--clr-accent)"
                            strokeWidth={2}
                            animate={{ r: hovered === i ? 5 : 3.5 }}
                            transition={{ duration: 0.15 }}
                        />
                        {/* Tooltip */}
                        {hovered === i && data[i].v > 0 && (
                            <g>
                                <rect
                                    x={x - 18} y={ys[i] - 28}
                                    width={36} height={20}
                                    rx={6}
                                    fill="var(--clr-foreground)"
                                />
                                <text
                                    x={x} y={ys[i] - 14}
                                    textAnchor="middle"
                                    fontSize={10} fontWeight={700}
                                    fill="hsl(42,100%,95%)"
                                >
                                    {data[i].v}
                                </text>
                            </g>
                        )}
                    </g>
                ))}

                {/* X-axis labels */}
                {xs.map((x, i) => (
                    <text key={i} x={x} y={H + 2} textAnchor="middle" fontSize={9} fontWeight={700}
                        fill={hovered === i ? 'var(--clr-accent)' : 'var(--clr-muted)'}
                        style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        {data[i].label}
                    </text>
                ))}
            </svg>
        </div>
    );
}

function StarBreakdown({ distribution }) {
    const total = distribution.reduce((s, n) => s + n, 0) || 1;
    return (
        <div className="flex flex-col gap-2">
            {[5, 4, 3, 2, 1].map((star, i) => {
                const count = distribution[5 - star] ?? 0;
                const pct = Math.round((count / total) * 100);
                return (
                    <div key={star} className="flex items-center gap-2">
                        <span className="text-xs font-bold w-3" style={{ color: 'var(--clr-muted)' }}>{star}</span>
                        <Star className="w-3 h-3 shrink-0" style={{ color: '#F5B942', fill: '#F5B942' }} />
                        <div className="flex-1 rounded-full overflow-hidden h-2" style={{ background: 'var(--clr-border)' }}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ delay: i * 0.07, type: 'spring', stiffness: 180, damping: 22 }}
                                className="h-full rounded-full"
                                style={{ background: star >= 4 ? 'var(--clr-primary)' : star === 3 ? '#F5B942' : 'var(--clr-accent)' }}
                            />
                        </div>
                        <span className="text-[10px] font-semibold w-6 text-right" style={{ color: 'var(--clr-muted)' }}>{pct}%</span>
                    </div>
                );
            })}
        </div>
    );
}

function ActionRow({ icon, label, sublabel, onClick, isLast, badge }) {
    return (
        <motion.button
            whileHover={{ x: 3, backgroundColor: 'color-mix(in srgb, var(--clr-primary) 3%, transparent)' }}
            onClick={onClick}
            className="group flex w-full items-center gap-4 text-left cursor-pointer py-3.5 px-1 rounded-xl border-b last:border-b-0"
            style={{ borderColor: isLast ? 'transparent' : 'var(--clr-border)' }}
        >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
                style={{ background: 'color-mix(in srgb, var(--clr-primary) 8%, transparent)', borderColor: 'var(--clr-border)' }}>
                {icon}
            </span>
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm" style={{ color: 'var(--clr-foreground)' }}>{label}</p>
                {sublabel && <p className="text-xs mt-0.5" style={{ color: 'var(--clr-muted)' }}>{sublabel}</p>}
            </div>
            <div className="flex items-center gap-2">
                {badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: 'color-mix(in srgb, var(--clr-accent) 12%, transparent)', color: 'var(--clr-accent)' }}>
                        {badge}
                    </span>
                )}
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" style={{ color: 'var(--clr-muted)' }} />
            </div>
        </motion.button>
    );
}

// Mock weekly ride data (last 7 days)
const WEEKLY_RIDES = [
    { label: 'M', v: 2 }, { label: 'T', v: 5 }, { label: 'W', v: 1 },
    { label: 'T', v: 4 }, { label: 'F', v: 7 }, { label: 'S', v: 3 }, { label: 'S', v: 0 }
];

// Coming Soon sheet
function ComingSoonSheet({ label, onClose }) {
    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
            <motion.div
                className="relative w-full rounded-t-3xl overflow-hidden"
                style={{ background: 'var(--clr-card)', boxShadow: '0 -8px 40px rgba(23,56,60,0.18)' }}
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            >
                {/* Drag pill */}
                <div className="flex justify-center pt-3 pb-2">
                    <span className="w-10 h-1 rounded-full" style={{ background: 'var(--clr-border)' }} />
                </div>
                <div className="px-6 pb-12 pt-4 text-center">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
                        style={{ background: 'color-mix(in srgb, var(--clr-accent) 10%, transparent)', border: '1.5px dashed var(--clr-accent)' }}>
                        <Zap className="w-7 h-7" style={{ color: 'var(--clr-accent)' }} />
                    </div>
                    <h3 className="text-xl font-black mb-2" style={{ color: 'var(--clr-foreground)', fontFamily: "'Manrope',sans-serif" }}>
                        Coming Soon
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--clr-muted)' }}>
                        <span className="font-semibold" style={{ color: 'var(--clr-foreground)' }}>{label}</span> is on its way.
                        We're building something great for you.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        onClick={onClose}
                        className="mt-6 w-full rounded-xl py-3 font-bold text-sm cursor-pointer"
                        style={{ background: 'var(--clr-primary)', color: 'hsl(42,100%,95%)' }}
                    >
                        Got it
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
}

// Mock star distribution [5★, 4★, 3★, 2★, 1★]
const STAR_DIST = [28, 10, 3, 1, 0];

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function RiderProfile() {
    const navigate = useNavigate();
    const { data, isLoading } = useUserProfile();
    const { data: rideDetailsData } = useRideDetails();

    const [editOpen, setEditOpen] = useState(false);
    const [phone, setPhone] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [editSaved, setEditSaved] = useState(false);
    const [showRideBell, setShowRideBell] = useState(false);
    const [comingSheet, setComingSheet] = useState(null); // label string or null

    const handleLogout = () => logoutRequest();

    const handleSaveProfile = () => {
        setEditSaved(true);
        setTimeout(() => { setEditSaved(false); setEditOpen(false); }, 1200);
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--clr-bg)' }}>
                <ProgressBar size="sm" isIndeterminate aria-label="Loading..." className="max-w-md" style={{ color: 'var(--clr-primary)' }} />
            </div>
        );
    }

    const user = data?.data;
    const activeRide = rideDetailsData?.data;
    const hasActiveRide = activeRide?.status &&
        activeRide.status !== RIDE_STATUS.CANCELLED &&
        activeRide.status !== RIDE_STATUS.COMPLETED;

    const userName = user?.email ? user.email.split('@')[0] : 'Rider';
    const avatarSrc = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userName)}&backgroundColor=e57453&textColor=fff8e8`;
    const rating = user?.rating_avg || '5.0';

    return (
        <>
            <div className="min-h-screen font-sans grain" style={{ background: 'var(--clr-bg)' }}>

                {/* ── Top bar ─────────────────────────────────────────────────────── */}
                <div className="sticky top-0 z-40 flex items-center justify-between px-5 py-4 backdrop-blur-xl border-b"
                    style={{ background: 'color-mix(in srgb, var(--clr-bg) 85%, transparent)', borderColor: 'var(--clr-border)' }}>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/ride/search')}
                        className="rounded-full border p-2.5 cursor-pointer"
                        style={{ background: 'var(--clr-card)', borderColor: 'var(--clr-border)' }}>
                        <ArrowLeft className="h-5 w-5" style={{ color: 'var(--clr-foreground)' }} />
                    </motion.button>

                    <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--clr-muted)' }}>My Profile</span>

                    {/* Ride notification bell */}
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => setShowRideBell(v => !v)}
                        className="relative rounded-full border p-2.5 cursor-pointer"
                        style={{ background: 'var(--clr-card)', borderColor: 'var(--clr-border)' }}>
                        <Bell className="h-5 w-5" style={{ color: 'var(--clr-foreground)' }} />
                        {hasActiveRide && (
                            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full border-2 animate-pulse"
                                style={{ background: 'var(--clr-accent)', borderColor: 'var(--clr-card)' }} />
                        )}
                    </motion.button>
                </div>

                {/* ── Ride Bell Dropdown ───────────────────────────────────────────── */}
                <AnimatePresence>
                    {showRideBell && (
                        <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.97 }}
                            transition={{ duration: 0.18 }}
                            className="mx-4 mt-2 rounded-2xl border overflow-hidden z-30 relative"
                            style={{ background: 'var(--clr-card)', borderColor: 'var(--clr-border)', boxShadow: '0 8px 32px rgba(23,56,60,0.12)' }}>
                            <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: 'var(--clr-border)' }}>
                                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--clr-muted)' }}>Current Ride</span>
                                <button onClick={() => setShowRideBell(false)} className="cursor-pointer">
                                    <X className="w-4 h-4" style={{ color: 'var(--clr-muted)' }} />
                                </button>
                            </div>
                            {hasActiveRide ? (
                                <div className="p-5">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide"
                                            style={{ background: 'color-mix(in srgb, var(--clr-primary) 12%, transparent)', color: 'var(--clr-primary)' }}>
                                            {activeRide.status?.replace('_', ' ')}
                                        </span>
                                        <span className="font-black text-lg" style={{ color: 'var(--clr-foreground)' }}>₹{activeRide.amount || '—'}</span>
                                    </div>
                                    <div className="space-y-2.5">
                                        <div className="flex items-start gap-2.5">
                                            <span className="mt-1 w-2.5 h-2.5 rounded-full shrink-0" style={{ background: 'var(--clr-primary)' }} />
                                            <p className="text-sm font-medium leading-snug" style={{ color: 'var(--clr-foreground)' }}>{activeRide.pickup_address || 'Pickup location'}</p>
                                        </div>
                                        <div className="flex items-start gap-2.5">
                                            <MapPin className="mt-0.5 w-3 h-3 shrink-0" style={{ color: 'var(--clr-accent)' }} />
                                            <p className="text-sm font-medium leading-snug" style={{ color: 'var(--clr-foreground)' }}>{activeRide.drop_address || 'Drop location'}</p>
                                        </div>
                                    </div>
                                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                        onClick={() => navigate('/ride/create')}
                                        className="mt-4 w-full rounded-xl py-2.5 text-sm font-bold cursor-pointer"
                                        style={{ background: 'var(--clr-primary)', color: 'hsl(42,100%,95%)' }}>
                                        Track Ride →
                                    </motion.button>
                                </div>
                            ) : (
                                <div className="px-5 py-8 text-center">
                                    <Car className="mx-auto w-8 h-8 mb-3" style={{ color: 'var(--clr-border)' }} />
                                    <p className="text-sm font-semibold" style={{ color: 'var(--clr-muted)' }}>No active ride right now</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Hero Banner ──────────────────────────────────────────────────── */}
                <div className="relative overflow-hidden mx-4 mt-4 rounded-3xl"
                    style={{ background: `linear-gradient(135deg, hsl(14,75%,61%) 0%, hsl(14,65%,52%) 60%, hsl(186,45%,22%) 100%)` }}>
                    {/* Decorative arcs */}
                    <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 400 220" fill="none">
                        <circle cx="380" cy="-30" r="140" stroke="white" strokeWidth="1.5" strokeDasharray="4 8" />
                        <circle cx="20" cy="220" r="100" stroke="white" strokeWidth="1" strokeDasharray="3 6" />
                    </svg>

                    <div className="relative z-10 flex items-center gap-5 px-6 py-7">
                        <div className="relative shrink-0">
                            <Avatar src={avatarSrc}
                                className="h-20 w-20 border-4 shadow-2xl"
                                style={{ borderColor: 'rgba(255,255,255,0.35)' }} />
                            <motion.button
                                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                onClick={() => setEditOpen(v => !v)}
                                className="absolute -bottom-1 -right-1 flex items-center justify-center w-7 h-7 rounded-full border-2 cursor-pointer"
                                style={{ background: 'white', borderColor: 'white' }}>
                                <Edit3 className="w-3.5 h-3.5" style={{ color: 'var(--clr-accent)' }} />
                            </motion.button>
                        </div>

                        <div className="min-w-0">
                            <h1 className="text-2xl font-black tracking-tight text-white truncate" style={{ fontFamily: "'Manrope', sans-serif" }}>
                                {displayName || userName}
                            </h1>
                            <p className="text-sm text-white/70 truncate mt-0.5">{user?.email || ''}</p>
                            <div className="flex items-center gap-2 mt-2.5">
                                <span className="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold"
                                    style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
                                    <Star className="w-3 h-3" style={{ fill: '#F5B942', color: '#F5B942' }} />
                                    {rating}
                                </span>
                                <span className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                                    style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>
                                    Rider
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Edit Profile Panel ───────────────────────────────────────────── */}
                <AnimatePresence>
                    {editOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden mx-4 mt-2">
                            <div className="rounded-2xl border p-5" style={{ background: 'var(--clr-card)', borderColor: 'var(--clr-border)' }}>
                                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--clr-muted)' }}>Edit Profile</p>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--clr-muted)' }}>Display Name</label>
                                        <input
                                            value={displayName}
                                            onChange={e => setDisplayName(e.target.value)}
                                            placeholder={userName}
                                            className="w-full rounded-xl px-4 py-3 text-sm font-medium border outline-none transition-all"
                                            style={{ background: 'var(--clr-bg)', borderColor: 'var(--clr-border)', color: 'var(--clr-foreground)' }}
                                            onFocus={e => { e.target.style.borderColor = 'var(--clr-accent)'; }}
                                            onBlur={e => { e.target.style.borderColor = 'var(--clr-border)'; }}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--clr-muted)' }}>Phone Number</label>
                                        <input
                                            value={phone}
                                            onChange={e => setPhone(e.target.value)}
                                            placeholder={user?.phone || '+91 XXXXX XXXXX'}
                                            className="w-full rounded-xl px-4 py-3 text-sm font-medium border outline-none transition-all"
                                            style={{ background: 'var(--clr-bg)', borderColor: 'var(--clr-border)', color: 'var(--clr-foreground)' }}
                                            onFocus={e => { e.target.style.borderColor = 'var(--clr-accent)'; }}
                                            onBlur={e => { e.target.style.borderColor = 'var(--clr-border)'; }}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                                        onClick={handleSaveProfile}
                                        className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold cursor-pointer"
                                        style={{ background: 'var(--clr-accent)', color: 'hsl(42,100%,95%)' }}>
                                        {editSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                                        {editSaved ? 'Saved!' : 'Save Changes'}
                                    </motion.button>
                                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                                        onClick={() => setEditOpen(false)}
                                        className="px-4 rounded-xl border text-sm font-semibold cursor-pointer"
                                        style={{ background: 'var(--clr-bg)', borderColor: 'var(--clr-border)', color: 'var(--clr-muted)' }}>
                                        Cancel
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Stats Strip ─────────────────────────────────────────────────── */}
                <div className="flex gap-3 px-4 mt-4 overflow-x-auto pb-1 no-scrollbar">
                    <StatPill label="Rides" value="42" icon={<Car className="w-4 h-4" style={{ color: 'var(--clr-primary)' }} />} accent="var(--clr-primary)" />
                    <StatPill label="Rating" value={rating} icon={<Star className="w-4 h-4" style={{ color: '#F5B942' }} />} accent="#F5B942" />
                    <StatPill label="Spent" value="₹3.2k" icon={<TrendingUp className="w-4 h-4" style={{ color: 'var(--clr-accent)' }} />} accent="var(--clr-accent)" />
                    <StatPill label="Since" value="2024" icon={<Zap className="w-4 h-4" style={{ color: 'var(--clr-primary)' }} />} accent="var(--clr-primary)" />
                </div>

                {/* ── Rides Area Chart ────────────────────────────────────────────── */}
                <div className="mx-4 mt-4 rounded-2xl border overflow-hidden" style={{ background: 'var(--clr-card)', borderColor: 'var(--clr-border)' }}>
                    {/* Chart header */}
                    <div className="flex items-start justify-between px-5 pt-5 pb-3">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--clr-muted)' }}>Rides This Week</p>
                            <p className="text-2xl font-black mt-1 leading-none" style={{ color: 'var(--clr-foreground)', fontFamily: "'Manrope',sans-serif" }}>22</p>
                            <p className="text-xs mt-1 font-medium" style={{ color: 'var(--clr-muted)' }}>
                                <span className="font-bold" style={{ color: 'var(--clr-accent)' }}>↑ 18%</span> vs last week
                            </p>
                        </div>
                        <div className="flex gap-2 items-center">
                            {WEEKLY_RIDES.map((d, i) => (
                                <div key={i} className="flex flex-col items-center gap-0.5">
                                    <span className="text-[9px] font-black" style={{ color: d.v === Math.max(...WEEKLY_RIDES.map(x => x.v)) ? 'var(--clr-accent)' : 'var(--clr-muted)' }}>{d.v}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Thin accent divider */}
                    <div className="h-px mx-5" style={{ background: 'var(--clr-border)' }} />
                    {/* Chart */}
                    <div className="px-4 pt-3 pb-5">
                        <RideAreaChart data={WEEKLY_RIDES} />
                    </div>
                </div>

                {/* ── Rating Breakdown ─────────────────────────────────────────────── */}
                <div className="mx-4 mt-4 rounded-2xl border p-5" style={{ background: 'var(--clr-card)', borderColor: 'var(--clr-border)' }}>
                    <div className="flex items-center gap-5 mb-5">
                        <div className="text-center">
                            <p className="text-5xl font-black leading-none" style={{ color: 'var(--clr-foreground)', fontFamily: "'Manrope',sans-serif" }}>{rating}</p>
                            <div className="flex items-center gap-0.5 mt-1.5 justify-center">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <Star key={s} className="w-3 h-3" style={{ fill: s <= Math.round(parseFloat(rating)) ? '#F5B942' : 'var(--clr-border)', color: s <= Math.round(parseFloat(rating)) ? '#F5B942' : 'var(--clr-border)' }} />
                                ))}
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-widest mt-1.5" style={{ color: 'var(--clr-muted)' }}>Your Rating</p>
                        </div>
                        <div className="flex-1 min-w-0">
                            <StarBreakdown distribution={STAR_DIST} />
                        </div>
                    </div>
                </div>

                {/* ── Quick Actions ────────────────────────────────────────────────── */}
                <div className="mx-4 mt-4 rounded-2xl border overflow-hidden" style={{ background: 'var(--clr-card)', borderColor: 'var(--clr-border)' }}>
                    <div className="px-5 pt-4 pb-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--clr-muted)' }}>Quick Actions</p>
                    </div>
                    <div className="px-4 pb-2">
                        <ActionRow icon={<MapPin className="w-4 h-4" style={{ color: 'var(--clr-primary)' }} />} label="Saved Places" sublabel="Home, Work, Favourites" badge="Soon" onClick={() => setComingSheet('Saved Places')} />
                        <ActionRow icon={<CreditCard className="w-4 h-4" style={{ color: 'var(--clr-primary)' }} />} label="Payment Methods" sublabel="UPI, Cards, Wallet" badge="Soon" onClick={() => setComingSheet('Payment Methods')} />
                        <ActionRow icon={<Clock className="w-4 h-4" style={{ color: 'var(--clr-primary)' }} />} label="Ride History" sublabel="View all past rides" badge="Soon" onClick={() => setComingSheet('Ride History')} isLast />
                    </div>
                </div>

                {/* ── Logout ───────────────────────────────────────────────────────── */}
                <div className="px-4 pb-16 pt-5">
                    <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                        onClick={handleLogout}
                        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border py-4 font-semibold transition-colors"
                        style={{ background: 'rgba(248,113,113,0.07)', borderColor: 'rgba(248,113,113,0.2)', color: '#F87171' }}>
                        <LogOut className="h-[18px] w-[18px]" />
                        Log Out
                    </motion.button>
                </div>
            </div>
            <AnimatePresence>
                {comingSheet && (
                    <ComingSoonSheet label={comingSheet} onClose={() => setComingSheet(null)} />
                )}
            </AnimatePresence>
        </>




    );
}


