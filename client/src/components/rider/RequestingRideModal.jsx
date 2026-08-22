import React from 'react';

export default function RequestingRideModal({ isOpen }) {
    if (!isOpen) return null;

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 rounded-xl">
            <div className="bg-white rounded-2xl p-6 shadow-lg flex flex-col items-center justify-center w-[85%] max-w-[320px]">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
                <h3 className="text-xl font-medium text-black text-center">Requesting your ride</h3>
            </div>
        </div>
    );
}
