import { motion } from 'framer-motion';
import { useState } from 'react';
import LocationInput from '../ui/LocationInput';



function Hero() {
    const [pickupCoords, setPickupCoords] = useState({});
    const [dropCoords, setDropCoords] = useState({});


    return (
        <section className="relative bg-black text-white pt-0 pb-32 px-6 overflow-hidden">
            <div className="absolute inset-0 opacity-40">
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
                <img src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop" alt="City traffic" className="w-full h-full object-cover" />
            </div>

            <div className="max-w-7xl mx-auto relative z-20 grid md:grid-cols-2 gap-12">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-bold leading-tight mb-6"
                    >
                        Go anywhere with RydeSaathi
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl text-gray-300 mb-8 max-w-md"
                    >
                        Request a ride, hop in, and go.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl p-6 text-black max-w-md w-full shadow-2xl"
                    >
                        <div className="space-y-4">
                            <LocationInput
                                placeholder="Enter pickup location"
                                onSelectLocation={setPickupCoords}
                            />

                            <LocationInput
                                placeholder="Enter destination"
                                onSelectLocation={setDropCoords}
                            />
                            <button
                                // onClick={() => setLocation('/login')}
                                className="w-full bg-black text-white rounded-lg py-3 font-semibold hover:bg-gray-800 transition-colors"
                            >
                                See prices
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default Hero