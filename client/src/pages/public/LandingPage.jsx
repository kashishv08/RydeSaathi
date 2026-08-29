import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Preloader from "../../components/shared/layout/Preloader";
import LandingNavbar from "../../components/public/landing/LandingNavbar";
import Hero from "../../components/public/landing/Hero";
import Stats from "../../components/public/landing/Stats";
import HowItWorks from "../../components/public/landing/HowItWorks";
import Safety from "../../components/public/landing/Safety";
import Drive from "../../components/public/landing/Drive";
import LandingFooter from "../../components/public/landing/LandingFooter";

export default function LandingPage() {
    const [loading, setLoading] = useState(true);

    return (
        <>
            <AnimatePresence>
                {loading && <Preloader onComplete={() => setLoading(false)} />}
            </AnimatePresence>

            <div className="grain min-h-[100dvh] overflow-hidden bg-[#fbf9f1] text-[#17383c] relative">
                <div className="fixed top-0 left-0 w-full z-40 bg-[#fbf9f1]/90 backdrop-blur-md border-b border-[#e7dfce]/60">
                    <LandingNavbar />
                </div>
                <main className="mt-[76px]">
                    <Hero />
                    <Stats />
                    <HowItWorks />
                    <Safety />
                    <Drive />
                    <LandingFooter />
                </main>
            </div>
        </>
    );
}
