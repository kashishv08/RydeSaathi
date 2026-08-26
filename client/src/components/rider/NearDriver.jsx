import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Banknote, ChevronDown, Users, Clock, Zap } from 'lucide-react';
import { vehicleDetails } from '../../constants/vehicleImages';
import { getArrivalTime } from '../../utils/vehicleHelpers';

export default function NearDriver({ options = [], onRequest }) {
    const [selected, setSelected] = useState(options[0]?.vehicle_type || null);

    if (!options || options.length === 0) return null;

    const selectedOption = options.find(o => o.vehicle_type === selected);

    return (
        <div className="flex flex-col flex-1 min-h-0">
            {/* Section label */}
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(139,92,246,0.7)' }}>
                Available Rides
            </p>

            {/* Ride option cards */}
            <div className="flex flex-col gap-2 flex-1 overflow-y-auto custom-scrollbar pb-2">
                {options.map((option, index) => {
                    const details = vehicleDetails[option.vehicle_type];
                    if (!details) return null;

                    const isSelected = selected === option.vehicle_type;
                    const isNearby = Math.ceil(option.pickup_eta) <= 2;

                    return (
                        <motion.div
                            key={option.vehicle_type}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.08, ease: 'easeOut' }}
                            onClick={() => setSelected(option.vehicle_type)}
                            className="flex items-center justify-between p-3.5 rounded-2xl cursor-pointer transition-all duration-200 relative overflow-hidden"
                            style={{
                                background: isSelected
                                    ? 'linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(91,33,182,0.06) 100%)'
                                    : 'rgba(255,255,255,0.03)',
                                border: isSelected
                                    ? '1.5px solid rgba(139,92,246,0.45)'
                                    : '1.5px solid rgba(255,255,255,0.07)',
                                boxShadow: isSelected ? '0 0 20px rgba(139,92,246,0.12)' : 'none',
                            }}
                            whileHover={{ scale: 1.01, borderColor: 'rgba(139,92,246,0.3)' }}
                            whileTap={{ scale: 0.99 }}
                        >
                            {/* Selected indicator bar */}
                            {isSelected && (
                                <motion.div
                                    layoutId="selected-bar"
                                    className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl"
                                    style={{ background: 'linear-gradient(to bottom, #8b5cf6, #5b21b6)' }}
                                />
                            )}

                            {/* Vehicle image */}
                            <div className="w-20 shrink-0 flex items-center justify-center">
                                <img
                                    src={details.image}
                                    alt={details.name}
                                    className="w-full h-auto object-contain drop-shadow-lg"
                                    style={{ filter: isSelected ? 'drop-shadow(0 0 8px rgba(139,92,246,0.4))' : 'none' }}
                                />
                            </div>

                            {/* Info block */}
                            <div className="flex-1 min-w-0 ml-3">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className="font-bold text-base text-white">{details.name}</span>
                                    <span
                                        className="flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                                        style={{
                                            background: 'rgba(255,255,255,0.07)',
                                            color: 'rgba(255,255,255,0.5)',
                                        }}
                                    >
                                        <Users className="w-2.5 h-2.5" />
                                        {details.capacity}
                                    </span>

                                    {isNearby && (
                                        <span
                                            className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                                            style={{
                                                background: 'rgba(16,185,129,0.12)',
                                                border: '1px solid rgba(16,185,129,0.25)',
                                                color: '#34d399',
                                            }}
                                        >
                                            <motion.div
                                                className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                                                animate={{ opacity: [1, 0.3, 1] }}
                                                transition={{ duration: 1.2, repeat: Infinity }}
                                            />
                                            Nearby
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                    <Clock className="w-3 h-3 shrink-0" />
                                    <span className="font-semibold text-gray-300">
                                        {Math.ceil(option.pickup_eta)} {Math.ceil(option.pickup_eta) === 1 ? 'min' : 'mins'}
                                    </span>
                                    <span>·</span>
                                    <span>{getArrivalTime(option.pickup_eta)}</span>
                                </div>

                                <p className="text-[11px] text-gray-600 mt-0.5 truncate">{details.description}</p>
                            </div>

                            {/* Fare */}
                            <div className="text-right shrink-0 ml-3">
                                <p className="text-lg font-black text-white tracking-tight">
                                    ₹{option.fare.toFixed(0)}
                                </p>
                                <p className="text-[10px] text-gray-600 font-medium">estimated</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Bottom CTA bar */}
            <AnimatePresence>
                {selected && (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 16 }}
                        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                        className="mt-3 pt-3 border-t"
                        style={{ borderColor: 'rgba(139,92,246,0.15)' }}
                    >
                        <div className="flex items-center gap-3">
                            {/* Payment pill */}
                            <div
                                className="flex items-center gap-2 px-3 py-3 rounded-xl cursor-pointer transition-all shrink-0"
                                style={{
                                    background: 'rgba(16,185,129,0.08)',
                                    border: '1px solid rgba(16,185,129,0.2)',
                                }}
                            >
                                <Banknote className="w-4 h-4 text-emerald-400" />
                                <span className="font-bold text-sm text-gray-200">Cash</span>
                                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                            </div>

                            {/* Request button */}
                            <motion.button
                                whileHover={{ scale: 1.02, y: -1 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => onRequest(selectedOption)}
                                className="flex-1 flex items-center justify-center gap-2 text-white font-bold text-sm py-3.5 rounded-xl transition-all"
                                style={{
                                    background: 'linear-gradient(135deg,#7c3aed,#5b21b6)',
                                    boxShadow: '0 6px 24px rgba(124,58,237,0.4)',
                                }}
                            >
                                <Zap className="w-4 h-4" />
                                Request {vehicleDetails[selected]?.name}
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}