
import { Avatar, ProgressBar } from "@heroui/react";
import { ArrowLeft, ChevronRight, Clock, CreditCard, LogOut, MapPin, Pencil, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logoutRequest } from '../../api/authApi';
import { useUserProfile } from '../../hooks/auth';
import { motion } from 'framer-motion';

const FONT_DISPLAY = "'Sora', sans-serif";
const FONT_MONO = "'IBM Plex Mono', monospace";
const VIOLET = "var(--clr-primary)";

// A single "stop" on the settings route — a node dot + dashed segment down to the next stop
function RouteRow({ icon, label, onClick, isLast }) {
    return (
        <button onClick={onClick} className="group flex w-full items-stretch gap-4 text-left cursor-pointer">
            <div className="flex w-8 flex-col items-center pt-4">
                <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full ring-4 transition-colors"
                    style={{ background: VIOLET, "--tw-ring-color": "color-mix(in srgb, var(--clr-primary) 12%, transparent)" }}
                />
                {!isLast && (
                    <span className="mt-1 w-px flex-1" style={{ borderLeft: "2px dashed var(--clr-border)" }} />
                )}
            </div>
            <div className="flex flex-1 items-center justify-between border-b py-4 pr-1" style={{ borderColor: isLast ? "transparent" : "var(--clr-border)" }}>
                <div className="flex items-center gap-3">
                    {icon}
                    <span className="font-semibold transition-colors" style={{ color: 'var(--clr-foreground)' }}>{label}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-600 transition-colors group-hover:text-gray-400" />
            </div>
        </button>
    );
}

function StatCard({ label, value }) {
    return (
        <div className="rounded-2xl border p-4" style={{ background: "var(--clr-card)", borderColor: "var(--clr-border)" }}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{label}</p>
            <p className="mt-1.5 text-2xl font-semibold" style={{ fontFamily: FONT_MONO, color: 'var(--clr-foreground)' }}>{value}</p>
        </div>
    );
}

export default function RiderProfile() {
    const navigate = useNavigate();
    const { data, isLoading } = useUserProfile();

    const handleLogout = () => logoutRequest();

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--clr-bg)' }}>
                <ProgressBar size="sm" isIndeterminate aria-label="Loading..." style={{ color: 'var(--clr-primary)' }} className="max-w-md" />
            </div>
        );
    }

    const user = data?.data;

    return (
        <div className="min-h-screen font-sans" style={{ background: 'var(--clr-bg)' }}>
            {/* Top bar */}
            <div className="flex items-center justify-between px-6 pt-8 pb-2">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/ride/search')}
                    className="rounded-full border p-2.5 text-gray-600 cursor-pointer"
                    style={{ background: "var(--clr-card)", borderColor: "var(--clr-border)" }}
                >
                    <ArrowLeft className="h-5 w-5" />
                </motion.button>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Profile</span>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="rounded-full border p-2.5 text-gray-600 cursor-pointer"
                    style={{ background: "var(--clr-card)", borderColor: "var(--clr-border)" }}
                >
                    <Pencil className="h-4 w-4" />
                </motion.button>
            </div>

            {/* Hero */}
            <div className="relative overflow-hidden px-6 pb-8 pt-6 text-center">
                {/* faint dashed route arcing behind the avatar — signature motif, not a blob */}
                <svg className="pointer-events-none absolute left-1/2 top-2 -z-0 -translate-x-1/2 opacity-30" width="340" height="140" viewBox="0 0 340 140" fill="none">
                    <path d="M10 120 C 90 10, 250 10, 330 120" stroke="var(--clr-primary)" strokeWidth="2" strokeDasharray="1 10" strokeLinecap="round" />
                </svg>

                <div className="relative">
                    <Avatar
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rider"
                        className="mx-auto h-24 w-24 border-4 text-large shadow-lg"
                        style={{ borderColor: "hsl(169,59%,31%,0.35)" }}
                    />
                    <div className="absolute bottom-0 right-1/2 translate-x-[38px] rounded-full border-2 p-1.5" style={{ background: VIOLET, borderColor: "var(--clr-bg)" }}>
                        <Star className="h-3.5 w-3.5 fill-white text-white" />
                    </div>
                </div>

                <h2 className="mt-4 text-2xl font-bold tracking-tight" style={{ fontFamily: FONT_DISPLAY, color: 'var(--clr-foreground)' }}>
                    {user?.email ? user.email.split('@')[0] : "Rider"}
                </h2>
                <div className="mt-2 flex items-center justify-center gap-2 text-sm font-medium text-gray-400">
                    <span className="flex items-center gap-1 rounded-full border px-2.5 py-0.5" style={{ borderColor: "var(--clr-border)", background: "var(--clr-card)" }}>
                        <span style={{ fontFamily: FONT_MONO, color: "#F5B942" }}>{user?.rating_avg || "5.0"}</span>
                        <Star className="h-3 w-3" style={{ fill: "#F5B942", color: "#F5B942" }} />
                    </span>
                    <span className="text-gray-600">•</span>
                    <span>{user?.phone || "No phone added"}</span>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 px-6">
                <StatCard label="Rides" value="42" />
                <StatCard label="Rating" value={user?.rating_avg || "5.0"} />
                <StatCard label="Since" value="2023" />
            </div>

            {/* Settings — route list */}
            <div className="mt-10 px-6">
                <h3 className="mb-2 px-1 text-[10px] font-bold uppercase tracking-widest text-gray-500">Your route</h3>
                <div className="flex flex-col">
                    <RouteRow
                        icon={<MapPin className="h-[18px] w-[18px] text-gray-400" />}
                        label="Saved Places"
                    />
                    <RouteRow
                        icon={<CreditCard className="h-[18px] w-[18px] text-gray-400" />}
                        label="Payment Methods"
                    />
                    <RouteRow
                        icon={<Clock className="h-[18px] w-[18px] text-gray-400" />}
                        label="Ride History"
                        isLast
                    />
                </div>
            </div>

            {/* Logout */}
            <div className="px-6 pb-14 pt-10">
                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border py-4 font-semibold transition-colors"
                    style={{ background: "rgba(248,113,113,0.08)", borderColor: "rgba(248,113,113,0.18)", color: "#F87171" }}
                >
                    <LogOut className="h-[18px] w-[18px]" />
                    Log Out
                </motion.button>
            </div>
        </div>
    );
}
