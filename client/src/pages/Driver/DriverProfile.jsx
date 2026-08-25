import { Avatar, Button, Card, ProgressBar } from "@heroui/react";
import { ArrowLeft, Car, ChevronRight, Clock, HelpCircle, LogOut, Shield, Star, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logoutRequest } from '../../api/authApi';
import { useUserProfile } from '../../hooks/auth';

export default function DriverProfile() {
    const navigate = useNavigate();
    const { data, isLoading } = useUserProfile();

    const handleLogout = () => {
        logoutRequest();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <ProgressBar size="sm" isIndeterminate aria-label="Loading..." className="max-w-md" />
            </div>
        );
    }

    const user = data?.data;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* Premium Header */}
            <div className="bg-black text-white px-6 pt-12 pb-24 relative overflow-hidden">
                {/* Abstract background elements */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

                <div className="relative z-10 flex items-center justify-between mb-8">
                    <button onClick={() => navigate('/driver')} className="hover:bg-white/10 p-2.5 rounded-full transition-colors cursor-pointer group">
                        <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <span className="font-bold text-lg tracking-wide uppercase text-white/90">Driver Profile</span>
                    <div className="w-10"></div> {/* Spacer */}
                </div>
            </div>

            {/* Profile Info Card (Overlapping) */}
            <div className="px-6 -mt-16 relative z-20">
                <Card className="w-full shadow-lg border-none bg-white rounded-3xl">
                    <div className="p-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="relative mb-4 group">
                                <Avatar
                                    src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/orange.jpg"
                                    className="w-24 h-24 text-large border-4 border-white shadow-md transition-transform group-hover:scale-105"
                                />
                                <div className="absolute bottom-0 right-0 bg-black text-white p-1.5 rounded-full shadow-sm border-2 border-white">
                                    <Star className="w-4 h-4 fill-white" />
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">{user?.email || "Driver"}</h2>
                            <div className="flex items-center gap-2 text-gray-500 text-sm mb-5 font-medium">
                                <span className="bg-gray-100 px-3 py-1 rounded-full text-black flex items-center gap-1">
                                    <Star className="w-3.5 h-3.5 fill-black" /> {user?.rating_avg || "4.9"}
                                </span>
                                <span>•</span>
                                <span>2,140 trips</span>
                            </div>

                            <div className="flex w-full gap-4 pt-2">
                                <Button className="flex-1 bg-black text-white font-medium shadow-md hover:shadow-lg transition-all" radius="full">
                                    Manage Vehicles
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 p-6">
                <Card className="bg-white border border-gray-100 shadow-sm rounded-2xl hover:border-gray-200 transition-colors">
                    <div className="p-4 flex flex-col justify-center relative overflow-hidden">
                        <TrendingUp className="absolute -right-2 -top-2 w-16 h-16 text-gray-50/50" />
                        <h3 className="text-gray-500 text-sm font-medium mb-1">Today's Earnings</h3>
                        <p className="text-2xl font-bold text-black tracking-tight">₹ 1,250</p>
                    </div>
                </Card>
                <Card className="bg-white border border-gray-100 shadow-sm rounded-2xl hover:border-gray-200 transition-colors">
                    <div className="p-4 flex flex-col justify-center relative overflow-hidden">
                        <Clock className="absolute -right-2 -top-2 w-16 h-16 text-gray-50/50" />
                        <h3 className="text-gray-500 text-sm font-medium mb-1">Online Time</h3>
                        <p className="text-2xl font-bold text-black tracking-tight">4h 30m</p>
                    </div>
                </Card>
            </div>

            {/* Vehicle Info */}
            <div className="px-6 mb-6">
                <Card className="bg-white border border-gray-100 shadow-sm rounded-2xl">
                    <div className="p-4 flex flex-row items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 shadow-sm">
                            <Car className="w-7 h-7 text-gray-800" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-lg">Toyota Prius</h3>
                            <p className="text-gray-500 text-sm font-medium">MH 01 AB 1234 • White</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                </Card>
            </div>

            {/* Menu Options */}
            <div className="flex-1 px-6 pb-12">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-2">Account</h3>

                <Card className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex flex-col">
                        <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-all group cursor-pointer active:bg-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gray-200 transition-colors border border-gray-100 shadow-sm">
                                    <Shield className="w-5 h-5 text-gray-700 group-hover:text-black" />
                                </div>
                                <span className="font-semibold text-gray-900">Insurance & Docs</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
                        </button>
                        <hr className="border-t border-gray-100 mx-4 my-0" />

                        <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-all group cursor-pointer active:bg-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gray-200 transition-colors border border-gray-100 shadow-sm">
                                    <Star className="w-5 h-5 text-gray-700 group-hover:text-black" />
                                </div>
                                <span className="font-semibold text-gray-900">Ratings & Feedback</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
                        </button>
                        <hr className="border-t border-gray-100 mx-4 my-0" />

                        <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-all group cursor-pointer active:bg-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gray-200 transition-colors border border-gray-100 shadow-sm">
                                    <HelpCircle className="w-5 h-5 text-gray-700 group-hover:text-black" />
                                </div>
                                <span className="font-semibold text-gray-900">Help & Support</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
                        </button>
                    </div>
                </Card>

                <Button
                    className="w-full mt-8 bg-red-50 text-red-600 font-bold py-6 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-100 transition-colors shadow-none border border-red-100"
                    onPress={handleLogout}
                    radius="md"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </Button>
            </div>
        </div>
    );
}
