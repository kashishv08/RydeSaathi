import { Globe } from "lucide-react";

const PRIMARY = "hsl(169, 59%, 31%)";
const BG = "hsl(193, 43%, 15%)";
const FG = "hsl(43, 38%, 96%)";
const MUTED = "hsl(193, 35%, 55%)";
const BORDER = "hsl(193, 35%, 25%)";

export default function Footer() {
    return (
        <footer className="pt-20 pb-10 px-6 border-t" style={{ background: BG, color: FG, borderColor: BORDER }}>
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <span className="text-2xl font-black tracking-tight" style={{ fontFamily: "'Manrope', sans-serif" }}>RydeSaathi</span>
                        <p className="text-sm mt-2" style={{ color: MUTED }}>Connecting destinations, empowering journeys.</p>
                    </div>
                    <a href="#" className="text-sm transition-colors underline underline-offset-4" style={{ color: MUTED }} >
                        Visit Help Center
                    </a>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 border-b pb-16" style={{ borderColor: BORDER }}>
                    <div>
                        <h4 className="font-semibold mb-6 text-sm uppercase tracking-wider" style={{ color: MUTED }}>Company</h4>
                        <ul className="space-y-3 text-sm" style={{ color: MUTED }}>
                            <li><a href="#" className="hover:text-white transition-colors">About us</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Our offerings</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Newsroom</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Investors</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-6 text-sm uppercase tracking-wider" style={{ color: MUTED }}>Products</h4>
                        <ul className="space-y-3 text-sm" style={{ color: MUTED }}>
                            <li><a href="#" className="hover:text-white transition-colors">Ride</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Drive</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Deliver</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Eat</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-6 text-sm uppercase tracking-wider" style={{ color: MUTED }}>Global citizenship</h4>
                        <ul className="space-y-3 text-sm" style={{ color: MUTED }}>
                            <li><a href="#" className="hover:text-white transition-colors">Safety</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Diversity and Inclusion</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Sustainability</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-6 text-sm uppercase tracking-wider" style={{ color: MUTED }}>Travel</h4>
                        <ul className="space-y-3 text-sm" style={{ color: MUTED }}>
                            <li><a href="#" className="hover:text-white transition-colors">Airports</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Cities</a></li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center text-xs gap-4" style={{ color: MUTED }}>
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-2"><Globe className="w-4 h-4" /> English</span>
                        <span>San Francisco</span>
                    </div>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Accessibility</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
