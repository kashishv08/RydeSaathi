import { useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck, Users, Navigation, Star } from "lucide-react";
import { Pill } from "./SharedUI";

export default function Safety() {
    const navigate = useNavigate();

    return (
        <section id="safety" className="bg-[#17383c] text-[#fbf3df]">
            <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 md:grid-cols-[1.05fr_.95fr] md:px-10 md:py-24">
                <div>
                    <Pill tone="gold"><ShieldCheck size={13} /> Safer together</Pill>
                    <h2 className="mt-6 max-w-xl font-display text-4xl font-extrabold leading-[1.03] tracking-[-.06em] md:text-6xl">A ride is better when you can breathe easy.</h2>
                    <p className="mt-6 max-w-lg text-base leading-7 text-[#bfd1c7]">Your route is shared, your driver is verified, and help is never more than a tap away. Because the city belongs to all of us.</p>
                    <button onClick={() => navigate("/ride/search")} className="cursor-pointer mt-8 rounded-xl bg-[#f2cf87] px-5 py-3 text-sm font-extrabold text-[#17383c] hover:bg-[#ffe0a0]" data-testid="button-safety-try">Try a Safer Ride <ArrowRight size={15} className="ml-1 inline" /></button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-[#214a4c] p-5">
                        <ShieldCheck className="text-[#f2cf87]" size={23} />
                        <p className="mt-12 font-display text-2xl font-extrabold">24/7</p>
                        <p className="mt-1 text-xs text-[#b8cbc2]">Saathi support</p>
                    </div>
                    <div className="mt-8 rounded-2xl bg-[#e57453] p-5 text-[#fff8e8]">
                        <Users size={23} />
                        <p className="mt-12 font-display text-2xl font-extrabold">1.8L+</p>
                        <p className="mt-1 text-xs text-[#ffe2d8]">verified partners</p>
                    </div>
                    <div className="rounded-2xl bg-[#d5e8dd] p-5 text-[#17383c]">
                        <Navigation size={23} />
                        <p className="mt-12 font-display text-2xl font-extrabold">8 min</p>
                        <p className="mt-1 text-xs text-[#55736c]">avg pickup time</p>
                    </div>
                    <div className="mt-8 rounded-2xl bg-[#f2cf87] p-5 text-[#17383c]">
                        <Star size={23} />
                        <p className="mt-12 font-display text-2xl font-extrabold">4.8/5</p>
                        <p className="mt-1 text-xs text-[#6e5b2e]">rider rating</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
