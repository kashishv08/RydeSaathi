import { useState } from 'react';
import { Avatar, ProgressBar } from "@heroui/react";
import {
    ArrowLeft, Bell, Car, Check, ChevronRight, Clock,
    Edit3, HelpCircle, LogOut, MapPin, Power, Save,
    Shield, Star, TrendingUp, X, Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logoutRequest } from '../../api/authApi';
import { useUserProfile } from '../../hooks/auth';
import { useDriverProfile, useDriverToggle } from '../../hooks/driver';
import { useRideDetails } from '../../hooks/rider';
import { motion, AnimatePresence } from 'framer-motion';
import { RIDE_STATUS, DRIVER_STATUS } from '../../constants';
import StaticRouteMap from '../../components/shared/StaticRouteMap';
import { getAvatarUrl } from '../../utils/avatarHelpers';

// ── Shared sub-components ─────────────────────────────────────────────────────

function StatPill({ label, value, icon, accent }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border px-4 py-5 flex-1 min-w-[72px]"
            style={{ background: 'var(--clr-card)', borderColor: 'var(--clr-border)' }}
        >
            <span className="flex items-center justify-center w-8 h-8 rounded-xl"
                style={{ background: `color-mix(in srgb, ${accent} 12%, transparent)` }}>
                {icon}
            </span>
            <span className="text-lg font-black font-mono leading-none text-center" style={{ color: 'var(--clr-foreground)' }}>{value}</span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-center" style={{ color: 'var(--clr-muted)' }}>{label}</span>
        </motion.div>
    );
}

function EarningsAreaChart({ data }) {
    const W = 300, H = 100, PAD = 12;
    const max = Math.max(...data.map(d => d.v), 1);
    const xs = data.map((_, i) => PAD + i * ((W - PAD * 2) / (data.length - 1)));
    const ys = data.map(d => PAD + (1 - d.v / max) * (H - PAD * 2));

    function smooth(pts) {
        if (pts.length < 2) return `M${pts[0][0]},${pts[0][1]}`;
        let d = `M${pts[0][0]},${pts[0][1]}`;
        for (let i = 0; i < pts.length - 1; i++) {
            const cx = (pts[i][0] + pts[i + 1][0]) / 2;
            d += ` C${cx},${pts[i][1]} ${cx},${pts[i + 1][1]} ${pts[i + 1][0]},${pts[i + 1][1]}`;
        }
        return d;
    }
    const pts = xs.map((x, i) => [x, ys[i]]);
    const smoothLine = smooth(pts);
    const smoothArea = `${smoothLine} L${xs[xs.length - 1]},${H - PAD} L${xs[0]},${H - PAD} Z`;

    const [hovered, setHovered] = useState(null);
    const gradId = 'earnGrad';

    return (
        <div className="relative w-full select-none">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 95, overflow: 'visible' }}>
                <defs>
                    <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--clr-primary)" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="var(--clr-primary)" stopOpacity="0.01" />
                    </linearGradient>
                </defs>
                {[0.33, 0.66, 1].map(f => (
                    <line key={f} x1={PAD} y1={PAD + (1 - f) * (H - PAD * 2)} x2={W - PAD} y2={PAD + (1 - f) * (H - PAD * 2)}
                        stroke="var(--clr-border)" strokeWidth="1" strokeDasharray="3 4" />
                ))}
                <motion.path d={smoothArea} fill={`url(#${gradId})`}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} />
                <motion.path d={smoothLine} fill="none"
                    stroke="var(--clr-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1, ease: 'easeOut' }} />
                {xs.map((x, i) => (
                    <g key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
                        <rect x={x - 12} y={PAD} width={24} height={H - PAD * 2} fill="transparent" />
                        <motion.circle cx={x} cy={ys[i]} r={hovered === i ? 4.5 : 3}
                            fill={hovered === i ? 'var(--clr-primary)' : 'var(--clr-card)'}
                            stroke="var(--clr-primary)" strokeWidth={1.5}
                            animate={{ r: hovered === i ? 4.5 : 3 }} transition={{ duration: 0.12 }} />
                        {hovered === i && data[i].v > 0 && (
                            <g>
                                <rect x={x - 22} y={ys[i] - 26} width={44} height={18} rx={5} fill="var(--clr-foreground)" />
                                <text x={x} y={ys[i] - 13} textAnchor="middle" fontSize={9} fontWeight={700} fill="hsl(42,100%,95%)">
                                    ₹{(data[i].v / 1000).toFixed(1)}k
                                </text>
                            </g>
                        )}
                    </g>
                ))}
                {xs.map((x, i) => (
                    <text key={i} x={x} y={H + 1} textAnchor="middle" fontSize={8} fontWeight={700}
                        fill={hovered === i ? 'var(--clr-primary)' : 'var(--clr-muted)'}
                        style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>
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

// Coming Soon sheet
function ComingSoonSheet({ label, onClose }) {
    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
            <motion.div
                className="relative w-full rounded-t-3xl overflow-hidden"
                style={{ background: 'var(--clr-card)', boxShadow: '0 -8px 40px rgba(23,56,60,0.18)' }}
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            >
                <div className="flex justify-center pt-3 pb-2">
                    <span className="w-10 h-1 rounded-full" style={{ background: 'var(--clr-border)' }} />
                </div>
                <div className="px-6 pb-12 pt-4 text-center">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
                        style={{ background: 'color-mix(in srgb, var(--clr-primary) 10%, transparent)', border: '1.5px dashed var(--clr-primary)' }}>
                        <Zap className="w-7 h-7" style={{ color: 'var(--clr-primary)' }} />
                    </div>
                    <h3 className="text-xl font-black mb-2" style={{ color: 'var(--clr-foreground)', fontFamily: "'Manrope',sans-serif" }}>Coming Soon</h3>
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

// Mock data
const WEEKLY_EARNINGS = [
    { label: 'M', v: 850 }, { label: 'T', v: 1420 }, { label: 'W', v: 620 },
    { label: 'T', v: 1890 }, { label: 'F', v: 2200 }, { label: 'S', v: 980 }, { label: 'S', v: 0 }
];
const STAR_DIST = [120, 42, 8, 2, 1];

// Status badge color helper
function statusColor(status) {
    if (status === DRIVER_STATUS.AVAILABLE) return { bg: 'color-mix(in srgb, var(--clr-primary) 12%, transparent)', text: 'var(--clr-primary)' };
    if (status === DRIVER_STATUS.ON_RIDE) return { bg: 'color-mix(in srgb, var(--clr-accent) 12%, transparent)', text: 'var(--clr-accent)' };
    return { bg: 'var(--clr-border)', text: 'var(--clr-muted)' };
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function DriverProfile() {
    const navigate = useNavigate();
    const { data: userResp, isLoading: userLoading } = useUserProfile();
    const { data: driverResp, isLoading: driverLoading } = useDriverProfile();
    const { data: rideResp } = useRideDetails();
    const { mutate: driverToggle } = useDriverToggle();

    const [isOnline, setIsOnline] = useState(() => sessionStorage.getItem('driverIsOnline') === 'true');
    const [editOpen, setEditOpen] = useState(false);
    const [phone, setPhone] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [vehicle, setVehicle] = useState('');
    const [editSaved, setEditSaved] = useState(false);
    const [showBell, setShowBell] = useState(false);
    const [comingSheet, setComingSheet] = useState(null);

    const handleLogout = () => logoutRequest();

    const handleToggleOnline = () => {
        const next = !isOnline;
        setIsOnline(next);
        sessionStorage.setItem('driverIsOnline', String(next));
        driverToggle({ online: next });
    };

    const handleSaveProfile = () => {
        setEditSaved(true);
        setTimeout(() => { setEditSaved(false); setEditOpen(false); }, 1200);
    };

    if (userLoading || driverLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--clr-bg)' }}>
                <ProgressBar size="sm" isIndeterminate aria-label="Loading..." className="max-w-md" style={{ color: 'var(--clr-primary)' }} />
            </div>
        );
    }

    const user = userResp?.data;
    const driver = driverResp?.data;
    const activeRide = rideResp?.data;
    const hasActiveRide = activeRide?.status &&
        activeRide.status !== RIDE_STATUS.CANCELLED &&
        activeRide.status !== RIDE_STATUS.COMPLETED;

    const userName = user?.email ? user.email.split('@')[0] : 'Driver';
    const avatarSrc = getAvatarUrl(userName, true);
    const rating = user?.rating_avg || driver?.rating_avg || '4.9';
    const driverStatus = driver?.status || (isOnline ? DRIVER_STATUS.AVAILABLE : DRIVER_STATUS.OFFLINE);
    const sColor = statusColor(driverStatus);

    // For mini-map — driver's last pinged location or city center
    const driverLoc = driver?.last_location
        ? { lat: driver.last_location.lat, lon: driver.last_location.lon, name: 'Your Location' }
        : { lat: 28.6139, lon: 77.2090, name: 'New Delhi' };

    return (
        <>
            <div className="min-h-screen font-sans grain" style={{ background: 'var(--clr-bg)' }}>

                {/* ── Top bar ─────────────────────────────────────────────────────── */}
                <div className="sticky top-0 z-40 flex items-center justify-between px-5 py-4 backdrop-blur-xl border-b"
                    style={{ background: 'color-mix(in srgb, var(--clr-bg) 85%, transparent)', borderColor: 'var(--clr-border)' }}>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/driver')}
                        className="rounded-full border p-2.5 cursor-pointer"
                        style={{ background: 'var(--clr-card)', borderColor: 'var(--clr-border)' }}>
                        <ArrowLeft className="h-5 w-5" style={{ color: 'var(--clr-foreground)' }} />
                    </motion.button>

                    <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--clr-muted)' }}>Driver Profile</span>

                    {/* Notification bell */}
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => setShowBell(v => !v)}
                        className="relative rounded-full border p-2.5 cursor-pointer"
                        style={{ background: 'var(--clr-card)', borderColor: 'var(--clr-border)' }}>
                        <Bell className="h-5 w-5" style={{ color: 'var(--clr-foreground)' }} />
                        {hasActiveRide && (
                            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full border-2 animate-pulse"
                                style={{ background: 'var(--clr-accent)', borderColor: 'var(--clr-card)' }} />
                        )}
                    </motion.button>
                </div>

                {/* ── Active Ride Bell Dropdown ────────────────────────────────────── */}
                <AnimatePresence>
                    {showBell && (
                        <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.97 }}
                            transition={{ duration: 0.18 }}
                            className="mx-4 mt-2 rounded-2xl border overflow-hidden relative z-30"
                            style={{ background: 'var(--clr-card)', borderColor: 'var(--clr-border)', boxShadow: '0 8px 32px rgba(23,56,60,0.12)' }}>
                            <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: 'var(--clr-border)' }}>
                                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--clr-muted)' }}>Current Ride</span>
                                <button onClick={() => setShowBell(false)} className="cursor-pointer">
                                    <X className="w-4 h-4" style={{ color: 'var(--clr-muted)' }} />
                                </button>
                            </div>
                            {hasActiveRide ? (
                                <div className="p-5">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide"
                                            style={{ background: 'color-mix(in srgb, var(--clr-primary) 12%, transparent)', color: 'var(--clr-primary)' }}>
                                            {activeRide.status?.replace(/_/g, ' ')}
                                        </span>
                                        <span className="font-black text-lg" style={{ color: 'var(--clr-foreground)' }}>₹{activeRide.amount || '—'}</span>
                                    </div>
                                    <div className="space-y-2.5">
                                        <div className="flex items-start gap-2.5">
                                            <span className="mt-1 w-2.5 h-2.5 rounded-full shrink-0" style={{ background: 'var(--clr-primary)' }} />
                                            <p className="text-sm font-medium leading-snug" style={{ color: 'var(--clr-foreground)' }}>{activeRide.pickup_address || 'Pickup'}</p>
                                        </div>
                                        <div className="flex items-start gap-2.5">
                                            <MapPin className="mt-0.5 w-3 h-3 shrink-0" style={{ color: 'var(--clr-accent)' }} />
                                            <p className="text-sm font-medium leading-snug" style={{ color: 'var(--clr-foreground)' }}>{activeRide.drop_address || 'Drop'}</p>
                                        </div>
                                    </div>
                                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                        onClick={() => navigate('/driver/active')}
                                        className="mt-4 w-full rounded-xl py-2.5 text-sm font-bold cursor-pointer"
                                        style={{ background: 'var(--clr-primary)', color: 'hsl(42,100%,95%)' }}>
                                        Go to Active Ride →
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
                    style={{ background: 'linear-gradient(135deg, hsl(174,58%,25%) 0%, hsl(174,58%,18%) 55%, hsl(186,45%,14%) 100%)' }}>
                    <svg className="absolute inset-0 w-full h-full opacity-[0.08] pointer-events-none" viewBox="0 0 400 220" fill="none">
                        <circle cx="380" cy="-30" r="150" stroke="white" strokeWidth="1.5" strokeDasharray="4 10" />
                        <circle cx="10" cy="230" r="110" stroke="white" strokeWidth="1" strokeDasharray="3 7" />
                    </svg>

                    <div className="relative z-10 flex items-center gap-5 px-6 py-7">
                        <div className="relative shrink-0">
                            <Avatar>
                                <Avatar.Image src={avatarSrc}
                                    className="h-30 w-30 shadow-2xl"
                                    style={{ borderColor: 'rgba(255,255,255,0.35)', position: "relative" }} />
                            </Avatar>
                            <motion.button
                                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                onClick={() => setEditOpen(v => !v)}
                                className="absolute -bottom-3 -right-3 flex items-center justify-center w-7 h-7 rounded-full border-2 cursor-pointer"
                                style={{ background: 'white', borderColor: 'white' }}>
                                <Edit3 className="w-3.5 h-3.5" style={{ color: 'var(--clr-primary)' }} />
                            </motion.button>
                        </div>

                        <div className="min-w-0 flex-1">
                            <h1 className="text-2xl font-black tracking-tight text-white truncate" style={{ fontFamily: "'Manrope', sans-serif" }}>
                                {displayName || userName}
                            </h1>
                            <p className="text-sm text-white/60 truncate mt-0.5">{user?.email || ''}</p>
                            <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                                <span className="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold"
                                    style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>
                                    <Star className="w-3 h-3" style={{ fill: '#F5B942', color: '#F5B942' }} />
                                    {rating}
                                </span>
                                <span className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                                    style={{ background: sColor.bg, color: sColor.text }}>
                                    {driverStatus?.replace(/_/g, ' ') || 'Offline'}
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
                                    {[
                                        { label: 'Display Name', value: displayName, set: setDisplayName, ph: userName },
                                        { label: 'Phone Number', value: phone, set: setPhone, ph: user?.phone || '+91 XXXXX XXXXX' },
                                        { label: 'Vehicle Number', value: vehicle, set: setVehicle, ph: driver?.vehicle_number || 'MH 01 AB 1234' },
                                    ].map(f => (
                                        <div key={f.label}>
                                            <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--clr-muted)' }}>{f.label}</label>
                                            <input
                                                value={f.value}
                                                onChange={e => f.set(e.target.value)}
                                                placeholder={f.ph}
                                                className="w-full rounded-xl px-4 py-3 text-sm font-medium border outline-none transition-all"
                                                style={{ background: 'var(--clr-bg)', borderColor: 'var(--clr-border)', color: 'var(--clr-foreground)' }}
                                                onFocus={e => { e.target.style.borderColor = 'var(--clr-primary)'; }}
                                                onBlur={e => { e.target.style.borderColor = 'var(--clr-border)'; }}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                                        onClick={handleSaveProfile}
                                        className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold cursor-pointer"
                                        style={{ background: 'var(--clr-primary)', color: 'hsl(42,100%,95%)' }}>
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

                {/* ── Online / Offline Toggle ──────────────────────────────────────── */}
                <div className="mx-4 mt-4 rounded-2xl border overflow-hidden" style={{ background: 'var(--clr-card)', borderColor: 'var(--clr-border)' }}>
                    <div className="flex items-center justify-between px-5 py-4">
                        <div>
                            <p className="font-bold" style={{ color: 'var(--clr-foreground)' }}>
                                {isOnline ? '🟢 You are Online' : '⚫ You are Offline'}
                            </p>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--clr-muted)' }}>
                                {isOnline ? 'Receiving ride requests' : 'Not receiving ride requests'}
                            </p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleToggleOnline}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm cursor-pointer border transition-all"
                            style={isOnline
                                ? { background: 'color-mix(in srgb, var(--clr-primary) 10%, transparent)', borderColor: 'color-mix(in srgb, var(--clr-primary) 30%, transparent)', color: 'var(--clr-primary)' }
                                : { background: 'var(--clr-bg)', borderColor: 'var(--clr-border)', color: 'var(--clr-muted)' }
                            }>
                            <Power className="w-4 h-4" />
                            {isOnline ? 'Go Offline' : 'Go Online'}
                        </motion.button>
                    </div>
                </div>

                {/* ── Stats Strip ─────────────────────────────────────────────────── */}
                <div className="flex gap-3 px-4 mt-4 overflow-x-auto pb-1 no-scrollbar">
                    <StatPill label="Today" value="₹1.2k" icon={<TrendingUp className="w-4 h-4" style={{ color: 'var(--clr-primary)' }} />} accent="var(--clr-primary)" />
                    <StatPill label="Rides" value="8" icon={<Car className="w-4 h-4" style={{ color: 'var(--clr-accent)' }} />} accent="var(--clr-accent)" />
                    <StatPill label="Rating" value={rating} icon={<Star className="w-4 h-4" style={{ color: '#F5B942' }} />} accent="#F5B942" />
                    <StatPill label="Online" value="4h" icon={<Zap className="w-4 h-4" style={{ color: 'var(--clr-primary)' }} />} accent="var(--clr-primary)" />
                </div>


                {/* ── Earnings Chart + Map  side-by-side ─────────────────────────── */}
                <div className="mx-4 mt-4 grid gap-3" style={{ gridTemplateColumns: '1fr 1fr' }}>

                    {/* Earnings card */}
                    <div className="rounded-2xl border overflow-hidden flex flex-col" style={{ background: 'var(--clr-card)', borderColor: 'var(--clr-border)' }}>
                        <div className="px-4 pt-4 pb-2">
                            <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'var(--clr-muted)' }}>Earnings</p>
                            <p className="text-base font-black mt-0.5 leading-none" style={{ color: 'var(--clr-foreground)', fontFamily: "'Manrope',sans-serif" }}>₹7,960</p>
                            <p className="text-[10px] mt-0.5 font-medium" style={{ color: 'var(--clr-muted)' }}>
                                <span className="font-bold" style={{ color: 'var(--clr-primary)' }}>↑ 12%</span> this week
                            </p>
                        </div>
                        <div className="h-px mx-3" style={{ background: 'var(--clr-border)' }} />
                        <div className="px-2 pt-2 pb-3 flex-1">
                            <EarningsAreaChart data={WEEKLY_EARNINGS} />
                        </div>
                    </div>

                    {/* Map card */}
                    <div className="rounded-2xl border overflow-hidden flex flex-col" style={{ borderColor: 'var(--clr-border)' }}>
                        <div className="px-4 pt-3.5 pb-2 flex items-center justify-between" style={{ background: 'var(--clr-card)' }}>
                            <div>
                                <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'var(--clr-muted)' }}>Location</p>
                                <p className="text-xs font-semibold mt-0.5 truncate" style={{ color: 'var(--clr-foreground)' }}>{driverLoc.name}</p>
                            </div>
                            <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${isOnline ? 'animate-pulse' : ''}`}
                                style={isOnline
                                    ? { background: 'color-mix(in srgb, var(--clr-primary) 12%, transparent)', color: 'var(--clr-primary)' }
                                    : { background: 'var(--clr-border)', color: 'var(--clr-muted)' }}>
                                <span className="w-1.5 h-1.5 rounded-full" style={{ background: isOnline ? 'var(--clr-primary)' : 'var(--clr-muted)' }} />
                                {isOnline ? 'Live' : 'Off'}
                            </span>
                        </div>
                        <div className="h-px" style={{ background: 'var(--clr-border)' }} />
                        <div className="relative flex-1" style={{ minHeight: '140px' }}>
                            <StaticRouteMap pickup={driverLoc} isOnline={isOnline} />
                        </div>
                    </div>
                </div>



                {/* ── Rating Breakdown ─────────────────────────────────────────────── */}
                <div className="mx-4 mt-4 rounded-2xl border p-5" style={{ background: 'var(--clr-card)', borderColor: 'var(--clr-border)' }}>
                    <div className="flex items-center gap-5">
                        <div className="text-center shrink-0">
                            <p className="text-5xl font-black leading-none" style={{ color: 'var(--clr-foreground)', fontFamily: "'Manrope',sans-serif" }}>{rating}</p>
                            <div className="flex items-center gap-0.5 mt-1.5 justify-center">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <Star key={s} className="w-3 h-3"
                                        style={{ fill: s <= Math.round(parseFloat(rating)) ? '#F5B942' : 'var(--clr-border)', color: s <= Math.round(parseFloat(rating)) ? '#F5B942' : 'var(--clr-border)' }} />
                                ))}
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-widest mt-1.5" style={{ color: 'var(--clr-muted)' }}>Driver Rating</p>
                        </div>
                        <div className="flex-1 min-w-0">
                            <StarBreakdown distribution={STAR_DIST} />
                        </div>
                    </div>
                </div>


                {/* ── Vehicle Card ─────────────────────────────────────────────────── */}
                <div className="mx-4 mt-4 rounded-2xl border overflow-hidden" style={{ background: 'var(--clr-card)', borderColor: 'var(--clr-border)' }}>
                    <div className="flex items-center">
                        <div className="flex w-20 shrink-0 flex-col items-center justify-center self-stretch border-r"
                            style={{ borderColor: 'color-mix(in srgb, var(--clr-primary) 20%, transparent)', borderStyle: 'dashed', background: 'color-mix(in srgb, var(--clr-primary) 5%, transparent)' }}>
                            <Car className="w-6 h-6" style={{ color: 'var(--clr-primary)' }} />
                        </div>
                        <div className="flex flex-1 items-center justify-between p-4 pl-5">
                            <div>
                                <h3 className="font-bold" style={{ color: 'var(--clr-foreground)' }}>
                                    {driver?.vehicle_name || vehicle || 'Toyota Prius'}
                                </h3>
                                <p className="text-sm mt-0.5 font-mono font-medium" style={{ color: 'var(--clr-muted)' }}>
                                    {driver?.vehicle_number || vehicle || 'MH 01 AB 1234'} · {driver?.vehicle_type || 'White'}
                                </p>
                            </div>
                            <ChevronRight className="h-5 w-5" style={{ color: 'var(--clr-muted)' }} />
                        </div>
                    </div>
                </div>

                {/* ── Account rows ─────────────────────────────────────────────────── */}
                <div className="mx-4 mt-4 rounded-2xl border overflow-hidden" style={{ background: 'var(--clr-card)', borderColor: 'var(--clr-border)' }}>
                    <div className="px-5 pt-4 pb-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--clr-muted)' }}>Account</p>
                    </div>
                    <div className="px-4 pb-2">
                        <ActionRow icon={<Shield className="w-4 h-4" style={{ color: 'var(--clr-primary)' }} />} label="Insurance & Docs" sublabel="Manage documents" badge="Soon" onClick={() => setComingSheet('Insurance & Docs')} />
                        <ActionRow icon={<Star className="w-4 h-4" style={{ color: 'var(--clr-primary)' }} />} label="Ratings & Feedback" sublabel="See what riders say" badge="Soon" onClick={() => setComingSheet('Ratings & Feedback')} />
                        <ActionRow icon={<Clock className="w-4 h-4" style={{ color: 'var(--clr-primary)' }} />} label="Ride History" sublabel="All completed rides" badge="Soon" onClick={() => setComingSheet('Ride History')} />
                        <ActionRow icon={<HelpCircle className="w-4 h-4" style={{ color: 'var(--clr-primary)' }} />} label="Help & Support" sublabel="Get assistance" badge="Soon" onClick={() => setComingSheet('Help & Support')} isLast />
                    </div>
                </div>


                {/* ── Logout ───────────────────────────────────────────────────────── */}
                <div className="px-4 pb-16 pt-5">
                    <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                        onClick={handleLogout}
                        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border py-4 font-semibold"
                        style={{ background: 'rgba(248,113,113,0.07)', borderColor: 'rgba(248,113,113,0.2)', color: '#F87171' }}>
                        <LogOut className="h-[18px] w-[18px]" />
                        Log Out
                    </motion.button>
                </div>
            </div>

            {/* ── Coming Soon Sheet ───────────────────────────────────────────────── */}
            <AnimatePresence>
                {comingSheet && (
                    <ComingSoonSheet label={comingSheet} onClose={() => setComingSheet(null)} />
                )}
            </AnimatePresence>
        </>
    );
}


