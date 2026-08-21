import Navbar from "../../components/shared/layout/Navbar";
import Footer from "../../components/shared/layout/Footer";
import Hero from "../../components/shared/layout/Hero";

export default function LandingPage() {

    return (
        <div className="min-h-screen bg-white">
            {/* Landing Navbar */}
            <Navbar />

            {/* Hero Section */}
            <Hero />


            {/* Safety */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-7xl mx-auto text-center max-w-3xl">
                    <h2 className="text-4xl font-bold mb-6">Your safety drives us</h2>
                    <p className="text-lg text-gray-600 mb-12">
                        Whether you’re in the back seat or behind the wheel, your safety is essential. We are committed to doing our part, and technology is at the heart of our approach.
                    </p>
                    <div className="grid md:grid-cols-2 gap-8 text-left">
                        <div className="p-8 border border-gray-200 rounded-2xl">
                            <h3 className="text-xl font-bold mb-2">Safety features</h3>
                            <p className="text-gray-600">Tell your loved ones where you are. Get help with the tap of a button. Technology makes travel safer than ever before.</p>
                        </div>
                        <div className="p-8 border border-gray-200 rounded-2xl">
                            <h3 className="text-xl font-bold mb-2">Community Guidelines</h3>
                            <p className="text-gray-600">We require our community to treat each other with respect. These rules reflect our commitment to a safe environment.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
}
