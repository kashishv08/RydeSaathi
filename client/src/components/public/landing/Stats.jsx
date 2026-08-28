import { IndianRupee, Crosshair, MessageCircle } from "lucide-react";

export default function Stats() {
    return (
        <section className="border-y border-[#e7dfce] bg-[#f4eddc]">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-5 py-6 md:px-10">
                <span className="text-xs font-bold uppercase tracking-[.14em] text-[#6d7c74]">A better way across town</span>
                <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-bold text-[#31585a]">
                    <span className="flex items-center gap-2"><IndianRupee size={16} className="text-[#e57453]" /> Honest fares</span>
                    <span className="flex items-center gap-2"><Crosshair size={16} className="text-[#e57453]" /> Pickup precision</span>
                    <span className="flex items-center gap-2"><MessageCircle size={16} className="text-[#e57453]" /> Human support</span>
                </div>
            </div>
        </section>
    );
}
