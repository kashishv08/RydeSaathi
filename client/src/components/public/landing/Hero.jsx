import { useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck, Clock as Clock3 } from "lucide-react";
import VehicleCarousel from "../../../components/shared/ui/VehicleCarousel";
import { Pill } from "./SharedUI";

export default function Hero() {
    const navigate = useNavigate();

    return (
        <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-2 md:grid-cols-[1.08fr_.92fr] md:px-10 md:pb-24 md:pt-2">
            <div className="relative z-10 animate-rise">
                <Pill tone="gold"><span className="h-1.5 w-1.5 rounded-full bg-[#e57453]" /> Your everyday, in motion</Pill>
                <h1 className="mt-6 max-w-2xl font-display text-[clamp(3rem,7vw,6.2rem)] font-extrabold leading-[.93] tracking-[-.075em] text-[#17383c]">The city feels <span className="text-[#1f756d]">closer</span> with a Saathi.</h1>
                <p className="mt-7 max-w-lg text-base leading-7 text-[#607873] md:text-lg">Book a bike, auto, or car for the way you actually move through Bengaluru. Clear fares, familiar faces, and one less thing to think about.</p>
                <div className="mt-9 flex flex-wrap items-center gap-3">
                    <button onClick={() => navigate("/ride/search")} className="cursor-pointer focus-ring rounded-xl bg-[#e57453] px-5 py-3.5 text-sm font-extrabold text-[#fff8e8] shadow-[0_10px_22px_rgba(229,116,83,.22)] transition-all hover:-translate-y-1" data-testid="button-hero-book">Where to? <ArrowRight size={16} className="ml-2 inline" /></button>
                    <button onClick={() => navigate("/driver")} className="cursor-pointer focus-ring rounded-xl border border-[#cfded5] bg-[#fffaf0] px-5 py-3.5 text-sm font-extrabold text-[#31585a] hover:border-[#8bbfb0]" data-testid="button-hero-drive">I want to drive</button>
                </div>
                <div className="mt-10 flex items-center gap-5 text-xs text-[#71827e]">
                    <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-[#1f756d]" /> Verified Saathis</span>
                    <span className="flex items-center gap-2"><Clock3 size={16} className="text-[#1f756d]" /> Pickup you can trust</span>
                </div>
            </div>
            <div className="relative animate-rise [animation-delay:140ms] flex items-center justify-center">
                <VehicleCarousel />
            </div>
        </section>
    );
}
