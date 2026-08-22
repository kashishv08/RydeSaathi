import React from 'react';
import { CreditCard, MapPin, Navigation } from 'lucide-react';

export default function FindingDriver({ pickup, drop, fare, statusText, subText, onCancel }) {
    return (
        <div className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white flex flex-col h-full max-h-[600px] overflow-y-auto">
            <div className="text-center mb-6 mt-4">
                <h2 className="text-2xl font-bold text-black mb-1">{statusText || "Ride requested"}</h2>
                <p className="text-gray-600 text-sm mb-4">{subText || "Finding drivers nearby"}</p>

                {/* Progress bar */}
                <div className="w-[80%] mx-auto h-1 bg-gray-200 rounded-full overflow-hidden relative">
                    <div className="absolute top-0 left-0 h-full w-1/3 bg-blue-600 rounded-full animate-[pulse_1.5s_ease-in-out_infinite] transition-all duration-1000"></div>
                </div>
            </div>

            <div className="flex-1 mt-2">
                <div className="relative pl-8 pr-2 space-y-6">
                    {/* Vertical line connecting pickup and dropoff */}
                    <div className="absolute left-[11px] top-[14px] bottom-[34px] w-0.5 bg-black"></div>

                    {/* Pickup */}
                    <div className="relative flex items-start justify-between">
                        <div className="absolute left-[-28px] top-1">
                            <div className="w-3 h-3 bg-black rounded-full border-4 border-white shadow-sm"></div>
                        </div>
                        <div>
                            <div className="text-lg font-medium text-black">Meet at {pickup || "Pickup Location"}</div>
                        </div>
                    </div>

                    {/* Dropoff */}
                    <div className="relative flex items-start justify-between">
                        <div className="absolute left-[-28px] top-1">
                            <div className="w-3 h-3 bg-white border-2 border-black rounded-sm"></div>
                        </div>
                        <div>
                            <div className="text-lg font-medium text-black">{drop || "Dropoff Location"}</div>
                        </div>
                        <button className="bg-gray-100 hover:bg-gray-200 text-black px-3 py-1.5 rounded-full text-sm font-medium transition-colors">
                            Change
                        </button>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                        <CreditCard size={24} className="text-black" />
                        <div>
                            <div className="text-lg font-medium text-black">₹{fare?.toFixed(2) || "0.00"}</div>
                            <div className="text-sm text-gray-500">Cash</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-4">
                <button
                    onClick={onCancel}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-red-700 font-medium text-lg py-3.5 rounded-xl transition-colors"
                >
                    Cancel ride
                </button>
            </div>
        </div>
    );
}
