import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import Preloader from "../../components/shared/layout/Preloader";
import Navbar from "../../components/shared/layout/Navbar";
import Hero from "../../components/shared/layout/Hero";
import HowItWorks from "../../components/shared/layout/HowItWorks";
import SaferTogether from "../../components/shared/layout/SaferTogether";
import DriveWithUs from "../../components/shared/layout/DriveWithUs";
import Footer from "../../components/shared/layout/Footer";

export default function LandingPage() {
    const [loading, setLoading] = useState(true);

    return (
        <>
            <AnimatePresence>
                {loading && <Preloader onComplete={() => setLoading(false)} />}
            </AnimatePresence>

            <div className="min-h-screen bg-[#0A0A0F] text-white selection:bg-[#8B5CF6]/40 selection:text-white">
                <Navbar />
                <Hero />
                <HowItWorks />
                <SaferTogether />
                <DriveWithUs />
                <Footer />
            </div>
        </>
    );
}
