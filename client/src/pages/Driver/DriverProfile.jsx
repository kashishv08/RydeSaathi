
import { Avatar, ProgressBar } from "@heroui/react";
import { ArrowLeft, Car, ChevronRight, Clock, HelpCircle, LogOut, Shield, Star, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logoutRequest } from '../../api/authApi';
import { useUserProfile } from '../../hooks/auth';
import { motion } from 'framer-motion';

const FONT_DISPLAY = "'Sora', sans-serif";
const FONT_MONO = "'IBM Plex Mono', monospace";
const EMERALD = "#22C55E";
const PAGE_BG = "#0A0A0F";

function RouteRow({ icon, label, isLast }) {
    return (
        <button className="group flex w-full items-stretch gap-4 text-left cursor-pointer">
            <div className="flex w-8 flex-col items-center pt-4">
                <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full ring-4"
                    style={{ background: EMERALD, "--tw-ring-color": "rgba(34,197,94,0.12)" }}
                />
                {!isLast && (
                    <span className="mt-1 w-px flex-1" style={{ borderLeft: "2px dashed rgba(255,255,255,0.14)" }} />
                )}
            </div>
            <div className="flex flex-1 items-center justify-between border-b py-4 pr-1" style={{ borderColor: isLast ? "transparent" : "rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-3">
                    {icon}
                    <span className="font-semibold text-gray-200 transition-colors group-hover:text-white">{label}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-600 transition-colors group-hover:text-gray-400" />
            </div>
        </button>
    );
}

function StatCard({ label, value, icon, tint }) {
    return (
        <div className="relative overflow-hidden rounded-2xl border p-4" style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}>
            <div className="absolute -right-2 -top-2 opacity-10" style={{ color: tint }}>{icon}</div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{label}</p>
            <p className="mt-1.5 text-2xl font-semibold text-white" style={{ fontFamily: FONT_MONO }}>{value}</p>
        </div>
    );
}

export default function DriverProfile() {
    const navigate = useNavigate();
    const { data, isLoading } = useUserProfile();

    const handleLogout = () => logoutRequest();

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#0A0A0F]">
                <ProgressBar size="sm" isIndeterminate aria-label="Loading..." className="max-w-md text-violet-400" />
            </div>
        );
    }

    const user = data?.data;

    return (
        <div className="min-h-screen bg-[#0A0A0F] font-sans">
            {/* Top bar */}
            <div className="flex items-center justify-between px-6 pt-8 pb-2">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/driver')}
                    className="rounded-full border p-2.5 text-gray-300 cursor-pointer"
                    style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
                >
                    <ArrowLeft className="h-5 w-5" />
                </motion.button>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Driver Profile</span>
                <div className="w-10" />
            </div>

            {/* Hero */}
            <div className="relative overflow-hidden px-6 pb-8 pt-6 text-center">
                <svg className="pointer-events-none absolute left-1/2 top-2 -z-0 -translate-x-1/2 opacity-30" width="340" height="140" viewBox="0 0 340 140" fill="none">
                    <path d="M10 120 C 90 10, 250 10, 330 120" stroke={EMERALD} strokeWidth="2" strokeDasharray="1 10" strokeLinecap="round" />
                </svg>

                <div className="relative">
                    <Avatar
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Driver"
                        className="mx-auto h-24 w-24 border-4 text-large shadow-lg"
                        style={{ borderColor: "rgba(34,197,94,0.35)" }}
                    />
                    <div className="absolute bottom-0 right-1/2 translate-x-[38px] rounded-full border-2 p-1.5" style={{ background: EMERALD, borderColor: PAGE_BG }}>
                        <Star className="h-3.5 w-3.5 fill-white text-white" />
                    </div>
                </div>

                <h2 className="mt-4 text-2xl font-bold tracking-tight text-white" style={{ fontFamily: FONT_DISPLAY }}>
                    {user?.email ? user.email.split('@')[0] : "Driver"}
                </h2>
                <div className="mt-2 flex items-center justify-center gap-2 text-sm font-medium text-gray-400">
                    <span className="flex items-center gap-1 rounded-full border px-2.5 py-0.5" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" }}>
                        <span style={{ fontFamily: FONT_MONO, color: "#F5B942" }}>{user?.rating_avg || "4.9"}</span>
                        <Star className="h-3 w-3" style={{ fill: "#F5B942", color: "#F5B942" }} />
                    </span>
                    <span className="text-gray-600">•</span>
                    <span>2,140 trips</span>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-5 rounded-full px-6 py-2.5 text-sm font-semibold text-white cursor-pointer"
                    style={{ background: `linear-gradient(135deg, ${EMERALD}, #15803D)`, boxShadow: "0 8px 20px -6px rgba(34,197,94,0.45)" }}
                >
                    Manage Vehicles
                </motion.button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 px-6">
                <StatCard label="Today's Earnings" value="₹1,250" icon={<TrendingUp className="h-16 w-16" />} tint={EMERALD} />
                <StatCard label="Online Time" value="4h 30m" icon={<Clock className="h-16 w-16" />} tint="#8B5CF6" />
            </div>

            {/* Vehicle — boarding pass */}
            <div className="mt-6 px-6">
                <div className="relative flex overflow-hidden rounded-3xl border" style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}>
                    <div className="flex w-24 shrink-0 flex-col items-center justify-center border-r-2" style={{ borderColor: "rgba(34,197,94,0.3)", borderStyle: "dashed" }}>
                        <Car className="h-7 w-7" style={{ color: EMERALD }} />
                    </div>
                    <span className="absolute -top-3 left-24 h-6 w-6 -translate-x-1/2 rounded-full" style={{ background: PAGE_BG }} />
                    <span className="absolute -bottom-3 left-24 h-6 w-6 -translate-x-1/2 rounded-full" style={{ background: PAGE_BG }} />
                    <button className="flex flex-1 cursor-pointer items-center justify-between p-4 pl-5">
                        <div>
                            <h3 className="text-left font-semibold text-white">Toyota Prius</h3>
                            <p className="text-sm font-medium text-gray-500" style={{ fontFamily: FONT_MONO }}>MH 01 AB 1234 · White</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                    </button>
                </div>
            </div>

            {/* Account — route list */}
            <div className="mt-10 px-6">
                <h3 className="mb-2 px-1 text-[10px] font-bold uppercase tracking-widest text-gray-500">Account</h3>
                <div className="flex flex-col">
                    <RouteRow icon={<Shield className="h-[18px] w-[18px] text-gray-400" />} label="Insurance & Docs" />
                    <RouteRow icon={<Star className="h-[18px] w-[18px] text-gray-400" />} label="Ratings & Feedback" />
                    <RouteRow icon={<HelpCircle className="h-[18px] w-[18px] text-gray-400" />} label="Help & Support" isLast />
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
