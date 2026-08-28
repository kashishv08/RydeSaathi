import { Navigation } from "lucide-react";

export function Logo() {
    return (
        <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#1f756d] text-[#fff8e8]">
                <Navigation size={18} fill="currentColor" className="rotate-45" />
            </div>
            <span className="font-display text-xl font-extrabold text-[#17383c]">RydeSaathi</span>
        </div>
    );
}

export function Pill({ children, tone = "default" }) {
    const tones = {
        default: "bg-[#e5dfd1] text-[#71827e]",
        gold: "bg-[#faebc8] text-[#8b6922]",
        coral: "bg-[#ffe2d8] text-[#c25a3a]",
    };
    return (
        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider ${tones[tone]}`}>
            {children}
        </span>
    );
}

export function MapCanvas() {
    return (
        <div className="h-64 w-full rounded-2xl bg-[#c5dac9] opacity-80 overflow-hidden relative">
            <svg className="absolute inset-0 h-full w-full opacity-30" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1f756d" strokeWidth="1" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
            <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-[#1f756d] rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
        </div>
    );
}
