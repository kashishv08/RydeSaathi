import React from 'react';
import { ArrowLeft, User, Car, Star, Shield, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DriverProfile() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-black text-white px-6 pt-12 pb-6">
                <button onClick={() => navigate('/driver')} className="mb-6">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center border-4 border-gray-800">
                        <User className="w-10 h-10 text-gray-300" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Ravi Kumar</h1>
                        <div className="flex items-center gap-2 text-gray-300 mt-1">
                            <span className="bg-gray-800 px-2 py-0.5 rounded text-sm font-semibold">4.9 ⭐</span>
                            <span>•</span>
                            <span className="text-sm">2,140 trips</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 p-6 -mt-4">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-semibold mb-1">Today's Earnings</h3>
                    <p className="text-2xl font-bold text-black">₹ 1,250</p>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-semibold mb-1">Online Time</h3>
                    <p className="text-2xl font-bold text-black">4h 30m</p>
                </div>
            </div>

            {/* Vehicle Info */}
            <div className="px-6 mb-6">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <Car className="w-6 h-6 text-black" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-black">Toyota Prius</h3>
                        <p className="text-gray-500 text-sm">MH 01 AB 1234 • White</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
            </div>

            {/* Menu Options */}
            <div className="flex-1 px-6">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Account</h3>
                
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-black" />
                            <span className="font-semibold text-black">Insurance & Docs</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <Star className="w-5 h-5 text-black" />
                            <span className="font-semibold text-black">Ratings & Feedback</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                            <HelpCircle className="w-5 h-5 text-black" />
                            <span className="font-semibold text-black">Help & Support</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <button className="w-full mt-8 mb-8 bg-gray-100 text-red-600 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </div>
    );
}
