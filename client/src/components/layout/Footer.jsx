
function Footer() {
    return (
        <footer className="bg-black text-white pt-20 pb-10 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                    <span className="text-2xl font-bold tracking-tight">RydeSaathi</span>
                    <p className="text-sm text-gray-400 mt-4 cursor-pointer hover:text-white transition-colors">Visit Help Center</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 border-b border-gray-800 pb-16">
                    <div>
                        <h4 className="font-semibold mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-white">About us</a></li>
                            <li><a href="#" className="hover:text-white">Our offerings</a></li>
                            <li><a href="#" className="hover:text-white">Newsroom</a></li>
                            <li><a href="#" className="hover:text-white">Investors</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-6">Products</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-white">Ride</a></li>
                            <li><a href="#" className="hover:text-white">Drive</a></li>
                            <li><a href="#" className="hover:text-white">Deliver</a></li>
                            <li><a href="#" className="hover:text-white">Eat</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-6">Global citizenship</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-white">Safety</a></li>
                            <li><a href="#" className="hover:text-white">Diversity and Inclusion</a></li>
                            <li><a href="#" className="hover:text-white">Sustainability</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-6">Travel</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-white">Airports</a></li>
                            <li><a href="#" className="hover:text-white">Cities</a></li>
                        </ul>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">
                    <div className="flex gap-6">
                        <span className="material-symbols-rounded">public</span>
                        <span>English</span>
                        <span>San Francisco</span>
                    </div>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white">Privacy</a>
                        <a href="#" className="hover:text-white">Accessibility</a>
                        <a href="#" className="hover:text-white">Terms</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer