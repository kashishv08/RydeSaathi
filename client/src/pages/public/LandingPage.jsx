import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
    ArrowRight,
    ShieldCheck,
    Clock as Clock3,
    Navigation,
    IndianRupee,
    Crosshair,
    MessageCircle,
    Users,
    Star,
    WalletCards,
    Car,
} from "lucide-react";
import Preloader from "../../components/shared/layout/Preloader";
import VehicleCarousel from "../../components/shared/ui/VehicleCarousel";

function Logo() {
    return (
        <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#1f756d] text-[#fff8e8]">
                <Navigation size={18} fill="currentColor" className="rotate-45" />
            </div>
            <span className="font-display text-xl font-extrabold text-[#17383c]">RydeSaathi</span>
        </div>
    );
}

function Pill({ children, tone = "default" }) {
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

function MapCanvas() {
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


const helpfulLinks = [
    { icon: Car, title: "Drive", copy: "Drive your own car or auto." },
    { icon: MessageCircle, title: "Delivery", copy: "Deliver food and packages locally." },
    { icon: Users, title: "Fleet", copy: "Manage multiple vehicles and drivers." },
];

export default function LandingPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    return (
        <>
            <AnimatePresence>
                {loading && <Preloader onComplete={() => setLoading(false)} />}
            </AnimatePresence>

            <div className="grain min-h-[100dvh] overflow-hidden bg-[#fbf9f1] text-[#17383c]">
                <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 md:px-10">
                    <Logo />
                    <div className="hidden items-center gap-8 text-sm font-semibold text-[#52716b] md:flex">
                        <a href="#how-it-works" className="hover:text-[#1f756d]" data-testid="link-how-it-works">How it works</a>
                        <a href="#safety" className="hover:text-[#1f756d]" data-testid="link-safety">Safer together</a>
                        <a href="#drive" className="hover:text-[#1f756d]" data-testid="link-drive">Drive with us</a>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate("/login")} className="hidden px-3 py-2 text-sm font-bold text-[#31585a] hover:text-[#1f756d] sm:block" data-testid="button-sign-in">Sign in</button>
                        <button onClick={() => navigate("/ride/search")} className="focus-ring rounded-xl bg-[#1f756d] px-4 py-2.5 text-sm font-bold text-[#fff8e8] shadow-[0_8px_16px_rgba(31,117,109,.18)] transition-transform hover:-translate-y-0.5" data-testid="button-landing-start">Book a ride <ArrowRight size={15} className="ml-1 inline" /></button>
                    </div>
                </nav>
                <main>
                    <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-2 md:grid-cols-[1.08fr_.92fr] md:px-10 md:pb-24 md:pt-2">
                        <div className="relative z-10 animate-rise">
                            <Pill tone="gold"><span className="h-1.5 w-1.5 rounded-full bg-[#e57453]" /> Your everyday, in motion</Pill>
                            <h1 className="mt-6 max-w-2xl font-display text-[clamp(3rem,7vw,6.2rem)] font-extrabold leading-[.93] tracking-[-.075em] text-[#17383c]">The city feels <span className="text-[#1f756d]">closer</span> with a Saathi.</h1>
                            <p className="mt-7 max-w-lg text-base leading-7 text-[#607873] md:text-lg">Book a bike, auto, or car for the way you actually move through Bengaluru. Clear fares, familiar faces, and one less thing to think about.</p>
                            <div className="mt-9 flex flex-wrap items-center gap-3">
                                <button onClick={() => navigate("/ride/search")} className="focus-ring rounded-xl bg-[#e57453] px-5 py-3.5 text-sm font-extrabold text-[#fff8e8] shadow-[0_10px_22px_rgba(229,116,83,.22)] transition-all hover:-translate-y-1" data-testid="button-hero-book">Where to? <ArrowRight size={16} className="ml-2 inline" /></button>
                                <button onClick={() => navigate("/driver")} className="focus-ring rounded-xl border border-[#cfded5] bg-[#fffaf0] px-5 py-3.5 text-sm font-extrabold text-[#31585a] hover:border-[#8bbfb0]" data-testid="button-hero-drive">I want to drive</button>
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
                    <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
                        <div className="grid gap-10 md:grid-cols-[.8fr_1.2fr]">
                            <div>
                                <Pill>Simple by design</Pill>
                                <h2 className="mt-5 max-w-md font-display text-4xl font-extrabold leading-[1.02] tracking-[-.06em] md:text-5xl">Less waiting.<br /><span className="text-[#e57453]">More living.</span></h2>
                                <p className="mt-5 max-w-sm text-sm leading-6 text-[#71827e]">From your first tap to the final hello, every part of your ride is made to feel predictable.</p>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-3">
                                {[["01", "Tell us where", "Drop a pin or type a landmark you know."], ["02", "Choose your way", "A quick bike, an auto with room, or a car."], ["03", "Go with ease", "Track your Saathi and settle in."]].map(([num, title, copy]) => (
                                    <div key={num} className="rounded-2xl border border-[#e5dfd1] bg-[#fffaf0] p-5 shadow-card">
                                        <span className="font-mono text-xs font-bold text-[#e57453]">{num}</span>
                                        <h3 className="mt-12 font-display text-lg font-extrabold">{title}</h3>
                                        <p className="mt-2 text-sm leading-6 text-[#71827e]">{copy}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                    <section id="safety" className="bg-[#17383c] text-[#fbf3df]">
                        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 md:grid-cols-[1.05fr_.95fr] md:px-10 md:py-24">
                            <div>
                                <Pill tone="gold"><ShieldCheck size={13} /> Safer together</Pill>
                                <h2 className="mt-6 max-w-xl font-display text-4xl font-extrabold leading-[1.03] tracking-[-.06em] md:text-6xl">A ride is better when you can breathe easy.</h2>
                                <p className="mt-6 max-w-lg text-base leading-7 text-[#bfd1c7]">Your route is shared, your driver is verified, and help is never more than a tap away. Because the city belongs to all of us.</p>
                                <button onClick={() => navigate("/ride/search")} className="mt-8 rounded-xl bg-[#f2cf87] px-5 py-3 text-sm font-extrabold text-[#17383c] hover:bg-[#ffe0a0]" data-testid="button-safety-try">Try a Safer Ride <ArrowRight size={15} className="ml-1 inline" /></button>
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
                    <section id="drive" className="mx-auto grid max-w-7xl gap-8 px-5 py-20 md:grid-cols-[.9fr_1.1fr] md:px-10 md:py-28">
                        <div className="rounded-[26px] bg-[#e7f1e9] p-7 md:p-10">
                            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#1f756d] text-[#fff8e8]"><WalletCards size={22} /></span>
                            <h2 className="mt-8 font-display text-4xl font-extrabold tracking-[-.06em]">Your road.<br />Your upside.</h2>
                            <p className="mt-4 max-w-sm text-sm leading-6 text-[#607873]">Choose when to go online, see the fare before you accept, and get paid weekly. Driving with RydeSaathi fits around your life.</p>
                            <button onClick={() => navigate("/driver")} className="mt-7 rounded-xl bg-[#1f756d] px-5 py-3 text-sm font-extrabold text-[#fff8e8]" data-testid="button-drive-learn">Explore driver mode <ArrowRight size={15} className="ml-1 inline" /></button>
                        </div>
                        <div className="flex flex-col justify-center">
                            <Pill tone="coral">For every kind of day</Pill>
                            <h2 className="mt-5 max-w-xl font-display text-4xl font-extrabold tracking-[-.06em] md:text-5xl">From chai runs to airport runs.</h2>
                            <div className="mt-8 divide-y divide-[#e5dfd1]">
                                {helpfulLinks.map(({ icon: Icon, title, copy }) => (
                                    <div key={title} className="flex gap-4 py-5 first:pt-0">
                                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#faebc8] text-[#8b6922]"><Icon size={18} /></span>
                                        <div>
                                            <h3 className="font-display font-extrabold">{title}</h3>
                                            <p className="mt-1 text-sm text-[#71827e]">{copy}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                    <footer className="border-t border-[#e5dfd1] px-5 py-7 md:px-10">
                        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
                            <Logo />
                            <span className="text-xs font-medium text-[#82918b]">Made for the way India moves · Bengaluru first</span>
                            <span className="text-xs font-bold text-[#31585a]">© 2024 RydeSaathi</span>
                        </div>
                    </footer>
                </main>
            </div>
        </>
    );
}
