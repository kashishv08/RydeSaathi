import { Button } from '@heroui/react';
import { ChevronDown, ChevronUp, CreditCard, Info, MessageSquare, Phone, Star } from 'lucide-react';
import { useRideDetails } from '../../hooks/rider';
import { CancelRideModal } from './CancelRideModal';

export default function DriverArriving({ onCancel, isInProgress = false, pickupEtaMins, destEtaMins }) {
    const { data: rideDetail } = useRideDetails();
    const otpArray = String(rideDetail?.data?.ride_otp).split('');

    const fallbackDestEta = rideDetail?.data?.route_duration_min ? Math.ceil(rideDetail.data.route_duration_min) : null;
    const finalDestEta = destEtaMins || fallbackDestEta;
    
    const pickupText = pickupEtaMins ? `Pickup in ${pickupEtaMins} min${pickupEtaMins > 1 ? 's' : ''}` : "Driver arriving soon";
    const dropoffText = finalDestEta ? `Drop-off in ${finalDestEta} min${finalDestEta > 1 ? 's' : ''}` : "Heading to Destination";

    return (
        <div className="border border-gray-200 rounded-xl shadow-sm bg-white flex flex-col h-full overflow-y-auto">

            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-black mx-auto">
                    {isInProgress ? dropoffText : pickupText}
                </h2>
                <button className="text-gray-500 hover:bg-gray-100 p-1 rounded-full transition-colors absolute right-4">
                    <ChevronUp size={24} />
                </button>
            </div>

            {/* PIN Section - Only show when waiting for pickup */}
            {!isInProgress && (
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-black">Share PIN with Driver</span>
                        <Info size={16} className="text-black" />
                    </div>
                    <div className="flex gap-2">
                        {otpArray.map((digit, index) => (
                            <div key={index} className="w-8 h-10 bg-[#276ef1] text-white flex items-center justify-center font-bold text-lg rounded">
                                {digit}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Driver Info */}
            <div className="p-4 border-b border-gray-100">
                <div className="flex justify-between items-start mb-4 relative">
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            {/* Dummy images for driver and car */}
                            <div className="w-16 h-16 bg-gray-300 rounded-full overflow-hidden border-2 border-white shadow-sm z-10 relative">
                                <img src="https://i.pravatar.cc/150?img=11" alt="Driver" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md border border-gray-100 z-20 whitespace-nowrap">
                                <Star size={12} className="fill-black" />
                                <span className="text-xs font-bold text-black">{rideDetail?.data?.driver_details?.rating || "5.0"}</span>
                            </div>
                        </div>
                        <span className="text-sm font-bold text-black mt-3">{rideDetail?.data?.driver_details?.name || "Driver"}</span>
                    </div>

                    <div className="absolute left-12 top-0 w-32 h-20">
                        {/* Placeholder for car image */}
                        <img src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1597151213/assets/67/034ebc-270f-4889-bc86-bc16e91122a2/original/UberXL.png" alt="Car" className="w-full h-full object-contain" />
                    </div>

                    <div className="text-right flex flex-col items-end z-10">
                        <div className="bg-gray-100 px-2 py-1 rounded text-lg font-bold tracking-wider text-black border border-gray-200">
                            {rideDetail?.data?.driver_details?.plate_number || "UP 16 AB 1234"}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">{rideDetail?.data?.driver_details?.vehicle_type || "Vehicle"}</div>
                        <div className="text-sm text-gray-500">Urban Cruiser</div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-4">
                    <button className="flex-1 bg-gray-100 hover:bg-gray-200 flex items-center justify-start px-4 py-3 rounded-xl transition-colors">
                        <MessageSquare size={20} className="mr-3" />
                        <span className="font-medium text-black">Send a message...</span>
                    </button>
                    <button className="bg-gray-100 hover:bg-gray-200 p-3 rounded-xl transition-colors flex items-center justify-center shrink-0 w-[52px]">
                        <Phone size={20} className="text-black" />
                    </button>
                </div>
            </div>

            {/* Trip Details */}
            <div className="p-4 flex-1">
                <div className="relative pl-8 pr-2 space-y-6">
                    <div className="absolute left-[11px] top-[14px] bottom-[34px] w-0.5 bg-black"></div>

                    <div className="relative flex items-start justify-between">
                        <div className="absolute left-[-28px] top-1">
                            <div className="w-3 h-3 bg-black rounded-full border-4 border-white shadow-sm"></div>
                        </div>
                        <div>
                            <div className="text-base font-medium text-black pr-2">{rideDetail?.data.pickup_address}</div>
                        </div>
                        <button className="bg-gray-100 hover:bg-gray-200 text-black px-3 py-1.5 rounded-full text-xs font-medium transition-colors shrink-0">
                            Change
                        </button>
                    </div>

                    <div className="relative flex items-start justify-between">
                        <div className="absolute left-[-28px] top-1">
                            <div className="w-3 h-3 bg-white border-2 border-black rounded-sm"></div>
                        </div>
                        <div>
                            <div className="text-base font-medium text-black">{rideDetail?.data.drop_address}</div>

                        </div>
                        <button className="bg-gray-100 hover:bg-gray-200 text-black px-3 py-1.5 rounded-full text-xs font-medium transition-colors shrink-0">
                            Change
                        </button>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <CreditCard size={24} className="text-black" />
                            <div>
                                <div className="text-base font-medium text-black">₹{rideDetail?.data.amount}</div>
                                <div className="text-xs text-gray-500">Cash</div>
                            </div>
                        </div>
                        <ChevronDown size={20} className="text-gray-400" />
                    </div>
                </div>
            </div>

            <div className="p-4">
                <CancelRideModal onConfirm={onCancel}>
                    <Button
                        type="button"
                        className="w-full bg-gray-100 hover:bg-gray-200 text-red-700 font-medium text-lg py-3.5 rounded-xl transition-colors h-auto"
                    >
                        Cancel ride
                    </Button>
                </CancelRideModal>
            </div>
        </div>
    );
}
