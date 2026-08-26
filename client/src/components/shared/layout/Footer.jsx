import { Globe } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#0A0A0F] text-white pt-20 pb-10 px-6 border-t border-white/10">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <span className="text-2xl font-black tracking-tight">RydeSaathi</span>
                        <p className="text-sm text-gray-500 mt-2">Connecting destinations, empowering journeys.</p>
                    </div>
                    <a href="#" className="text-sm text-gray-300 hover:text-[#8B5CF6] transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-[#8B5CF6]">
                        Visit Help Center
                    </a>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 border-b border-white/10 pb-16">
                    <div>
                        <h4 className="font-semibold mb-6 text-sm uppercase tracking-wider text-gray-500">Company</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">About us</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Our offerings</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Newsroom</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Investors</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-6 text-sm uppercase tracking-wider text-gray-500">Products</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">Ride</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Drive</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Deliver</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Eat</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-6 text-sm uppercase tracking-wider text-gray-500">Global citizenship</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">Safety</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Diversity and Inclusion</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Sustainability</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-6 text-sm uppercase tracking-wider text-gray-500">Travel</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">Airports</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Cities</a></li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">
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
