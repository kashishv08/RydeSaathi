import { useState } from 'react';
import { User, Banknote, ChevronDown } from 'lucide-react';
import { vehicleDetails } from '../../constants/vehicleImages';
import { getArrivalTime } from '../../utils/vehicleHelpers';

export default function NearDriver({ options = [], onRequest }) {
    const [selectedRide, setSelectedRide] = useState(options[0]?.vehicle_type || null);

    if (!options || options.length === 0) return null;

    return (
        <div className="flex flex-col mt-4 flex-1">
            <h3 className="text-2xl font-bold mb-4 text-black">Rides we think you'll like</h3>

            <div className="flex flex-col space-y-1 mb-4">
                {options.map((option, index) => {
                    const details = vehicleDetails[option.vehicle_type];
                    if (!details) return null;

                    const isSelected = selectedRide === option.vehicle_type;

                    return (
                        <div
                            key={index}
                            onClick={() => setSelectedRide(option.vehicle_type)}
                            className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${isSelected ? 'border-[3px] border-black bg-white shadow-sm' : 'border-[3px] border-transparent hover:bg-gray-100'
                                }`}
                        >
                            <div className="flex items-center space-x-3 w-[70%]">
                                <div className="w-20 shrink-0">
                                    <img src={details.image} alt={details.name} className="w-full h-auto object-contain drop-shadow-md" />
                                </div>

                                <div className="flex flex-col flex-1">
                                    <div className="flex items-center space-x-1.5">
                                        <span className="font-bold text-xl">{details.name}</span>
                                        <div className="flex items-center text-sm font-bold text-gray-800">
                                            <User size={14} className="fill-current" />
                                            {details.capacity}
                                        </div>
                                    </div>
                                    <div className="text-sm font-medium text-black">
                                        {Math.ceil(option.pickup_eta)} {Math.ceil(option.pickup_eta) === 1 ? 'min' : 'mins'} away <span className="text-gray-500 font-normal">• {getArrivalTime(option.pickup_eta)}</span>
                                    </div>
                                    <div className="text-sm text-gray-500 leading-tight">
                                        {details.description}
                                    </div>
                                    {Math.ceil(option.pickup_eta) <= 2 && (
                                        <div className="mt-1">
                                            <span className="bg-[#276ef1] text-white text-[11px] font-bold px-1.5 py-0.5 rounded">
                                                Driver nearby
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="font-bold text-xl w-[25%] text-right shrink-0">
                                ₹{option.fare.toFixed(2)}
                            </div>
                        </div>
                    );
                })}
            </div>

            {selectedRide && (
                <div className="sticky bottom-0 bg-white pt-2 pb-2 mt-auto z-10">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 w-1/3">
                            <div className="flex items-center gap-2">
                                <div className="text-[#137333]">
                                    <Banknote size={24} className="fill-[#e6f4ea]" />
                                </div>
                                <span className="font-medium text-black text-lg">Cash</span>
                            </div>
                            <ChevronDown size={20} className="text-black" />
                        </div>

                        <button
                            onClick={() => {
                                const selectedOption = options.find(o => o.vehicle_type == selectedRide);
                                onRequest(selectedOption)
                            }}
                            className="flex-1 bg-black text-white font-bold text-xl py-3.5 rounded-xl hover:bg-gray-800 transition-colors"
                        >
                            Request {vehicleDetails[selectedRide]?.name}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}