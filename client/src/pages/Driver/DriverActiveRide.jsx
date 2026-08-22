import React, { useState } from 'react';
import { Phone, MessageSquare, Navigation, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DriverActiveRide() {
    const navigate = useNavigate();
    // 'heading_to_pickup' -> 'waiting_for_rider' -> 'in_progress' -> 'completed'
    const [rideStatus, setRideStatus] = useState('heading_to_pickup');

    // Dummy ride data
    const ride = {
        pickup_address: "123 Main St, Central Park",
        drop_address: "456 Market St, Downtown",
        rider_name: "Kashish V.",
        rider_rating: "4.9",
        amount: 245.50
    };

    const handleAction = () => {
        if (rideStatus === 'heading_to_pickup') setRideStatus('waiting_for_rider');
        else if (rideStatus === 'waiting_for_rider') setRideStatus('in_progress');
        else if (rideStatus === 'in_progress') {
            alert(`Ride Completed! Collected ₹${ride.amount}`);
            navigate('/driver'); // Back to dashboard
        }
    };

    const getStatusText = () => {
        switch(rideStatus) {
            case 'heading_to_pickup': return "Heading to Pickup";
            case 'waiting_for_rider': return "Arrived at Pickup";
            case 'in_progress': return "Heading to Drop-off";
            default: return "";
        }
    };

    const getActionText = () => {
        switch(rideStatus) {
            case 'heading_to_pickup': return "Slide to Arrive";
            case 'waiting_for_rider': return "Start Ride";
            case 'in_progress': return "Complete Ride";
            default: return "";
        }
    };

    const getDestinationAddress = () => {
        return rideStatus === 'in_progress' ? ride.drop_address : ride.pickup_address;
    };

    return (
        <div className="h-screen w-full flex flex-col bg-gray-50 relative overflow-hidden">
            {/* Top Navigation Strip */}
            <div className="absolute top-0 left-0 right-0 z-20 bg-black text-white p-6 shadow-lg rounded-b-3xl">
                <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-full">
                        <Navigation className="w-8 h-8 text-white fill-white transform rotate-45" />
                    </div>
                    <div>
                        <p className="text-white/70 font-semibold text-sm uppercase tracking-wider">{getStatusText()}</p>
                        <h1 className="text-2xl font-bold truncate pr-4">{getDestinationAddress()}</h1>
                    </div>
                </div>
            </div>

            {/* Map Area (Dummy) */}
            <div className="flex-1 bg-gray-200 relative pt-32">
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>
                
                {/* Route Polyline Simulation */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-l-4 border-t-4 border-black rounded-tl-3xl opacity-50 pointer-events-none"></div>
                
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                    <Navigation className="w-12 h-12 text-black fill-black transform rotate-45" />
                </div>
            </div>

            {/* Bottom Sheet - Rider Info & Actions */}
            <div className="bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-6 z-20 relative">
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
                
                {/* Rider Info */}
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold text-gray-500">
                            {ride.rider_name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-black">{ride.rider_name}</h3>
                            <p className="text-gray-500 font-medium font-semibold text-sm">⭐ {ride.rider_rating}</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-3">
                        <button className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                            <MessageSquare className="w-5 h-5 text-black" />
                        </button>
                        <button className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                            <Phone className="w-5 h-5 text-black" />
                        </button>
                    </div>
                </div>

                {/* Main Action Button */}
                <button 
                    onClick={handleAction}
                    className="w-full bg-black text-white font-bold py-5 rounded-xl text-xl hover:bg-gray-800 transition-colors shadow-xl relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
                    {getActionText()}
                </button>
            </div>
        </div>
    );
}
