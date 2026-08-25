import { Avatar, Button, Card, ProgressBar } from "@heroui/react";
import { ArrowLeft, ChevronRight, Clock, CreditCard, LogOut, MapPin, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logoutRequest } from '../../api/authApi';
import { useUserProfile } from '../../hooks/auth';

export default function RiderProfile() {
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
                {/* Abstract background blobs */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>

                <div className="relative z-10 flex items-center justify-between mb-8">
                    <button onClick={() => navigate('/ride/search')} className="hover:bg-white/10 p-2 rounded-full transition-colors cursor-pointer">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <span className="font-semibold text-lg tracking-wide">Profile</span>
                    <div className="w-10"></div> {/* Spacer for centering */}
                </div>
            </div>

            {/* Profile Info Card (Overlapping header) */}
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

                            <h2 className="text-2xl font-bold text-gray-900 mb-1">{user?.email || "Rider"}</h2>
                            <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                                <span className="font-medium bg-gray-100 px-2.5 py-0.5 rounded-full text-black">{user?.rating_avg || "5.0"} ⭐</span>
                                <span>•</span>
                                <span>{user?.phone || "No phone added"}</span>
                            </div>

                            <div className="flex w-full gap-4 pt-2">
                                <Button className="flex-1 bg-black text-white font-medium shadow-md hover:shadow-lg transition-all" radius="full">
                                    Edit Profile
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Stats / Quick Info */}
            <div className="px-6 mt-6">
                <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-white border border-gray-100 shadow-sm rounded-2xl hover:border-gray-200 transition-colors">
                        <div className="p-4 flex flex-col justify-center">
                            <h3 className="text-gray-500 text-sm font-medium mb-1">Total Rides</h3>
                            <p className="text-3xl font-bold text-black tracking-tight">42</p>
                        </div>
                    </Card>
                    <Card className="bg-white border border-gray-100 shadow-sm rounded-2xl hover:border-gray-200 transition-colors">
                        <div className="p-4 flex flex-col justify-center">
                            <h3 className="text-gray-500 text-sm font-medium mb-1">Member Since</h3>
                            <p className="text-lg font-bold text-black tracking-tight">2023</p>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Account Settings Menu */}
            <div className="flex-1 px-6 mt-8 mb-12">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-2">Settings</h3>

                <Card className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex flex-col">
                        <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-black/5 transition-colors">
                                    <MapPin className="w-5 h-5 text-gray-700" />
                                </div>
                                <span className="font-medium text-gray-900">Saved Places</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-300" />
                        </button>
                        <hr className="border-t border-gray-100/80 mx-4 my-0" />

                        <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-black/5 transition-colors">
                                    <CreditCard className="w-5 h-5 text-gray-700" />
                                </div>
                                <span className="font-medium text-gray-900">Payment Methods</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-300" />
                        </button>
                        <hr className="border-t border-gray-100/80 mx-4 my-0" />

                        <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-black/5 transition-colors">
                                    <Clock className="w-5 h-5 text-gray-700" />
                                </div>
                                <span className="font-medium text-gray-900">Ride History</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-300" />
                        </button>
                    </div>
                </Card>

                <Button
                    className="w-full mt-8 bg-red-50 text-red-600 font-bold py-6 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-100 transition-colors shadow-none border border-red-100"
                    onPress={handleLogout}
                    radius="md"
                >
                    <LogOut className="w-5 h-5" />
                    Log Out
                </Button>
            </div>
        </div>
    );
}
