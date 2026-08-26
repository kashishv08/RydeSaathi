import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Banknote, ChevronDown, Users, Clock, Zap } from 'lucide-react';
import { vehicleDetails } from '../../constants/vehicleImages';
import { getArrivalTime } from '../../utils/vehicleHelpers';

const PRIMARY = 'hsl(169, 59%, 31%)';
const ACCENT = 'hsl(14, 83%, 62%)';
const FG = 'hsl(193, 43%, 15%)';
const MUTED = 'hsl(193, 15%, 45%)';
const CARD_BG = 'hsl(44, 44%, 99%)';
const CARD_SEL = 'hsl(169, 59%, 31%, 0.06)';
const BORDER = 'hsl(38, 24%, 86%)';
const BORDER_SEL = 'hsl(169, 59%, 31%, 0.4)';

export default function NearDriver({ options = [], onRequest }) {
    const [selected, setSelected] = useState(options[0]?.vehicle_type || null);

    if (!options || options.length === 0) return null;

    const selectedOption = options.find(o => o.vehicle_type === selected);

    return (
        <div className="flex flex-col flex-1 min-h-0">
            {/* Section label */}
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: PRIMARY }}>
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
                                background: isSelected ? CARD_SEL : CARD_BG,
                                border: `1.5px solid ${isSelected ? BORDER_SEL : BORDER}`,
                                boxShadow: isSelected ? '0 0 20px hsl(169,59%,31%,0.1)' : 'none',
                            }}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                        >
                            {/* Selected indicator bar */}
                            {isSelected && (
                                <motion.div
                                    layoutId="selected-bar"
                                    className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl"
                                    style={{ background: `linear-gradient(to bottom, ${PRIMARY}, hsl(169,59%,20%))` }}
                                />
                            )}

                            {/* Vehicle image */}
                            <div className="w-20 shrink-0 flex items-center justify-center">
                                <img
                                    src={details.image}
                                    alt={details.name}
                                    className="w-full h-auto object-contain drop-shadow-lg"
                                    style={{ filter: isSelected ? `drop-shadow(0 0 8px hsl(169,59%,31%,0.35))` : 'none' }}
                                />
                            </div>

                            {/* Info block */}
                            <div className="flex-1 min-w-0 ml-3">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className="font-bold text-base" style={{ color: FG }}>{details.name}</span>
                                    <span
                                        className="flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                                        style={{ background: 'hsl(38,24%,90%)', color: MUTED }}
                                    >
                                        <Users className="w-2.5 h-2.5" />
                                        {details.capacity}
                                    </span>

                                    {isNearby && (
                                        <span
                                            className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                                            style={{
                                                background: 'hsl(169,59%,31%,0.1)',
                                                border: '1px solid hsl(169,59%,31%,0.25)',
                                                color: PRIMARY,
                                            }}
                                        >
                                            <motion.div
                                                className="w-1.5 h-1.5 rounded-full"
                                                style={{ background: PRIMARY }}
                                                animate={{ opacity: [1, 0.3, 1] }}
                                                transition={{ duration: 1.2, repeat: Infinity }}
                                            />
                                            Nearby
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-1.5 text-xs" style={{ color: MUTED }}>
                                    <Clock className="w-3 h-3 shrink-0" />
                                    <span className="font-semibold" style={{ color: FG }}>
                                        {Math.ceil(option.pickup_eta)} {Math.ceil(option.pickup_eta) === 1 ? 'min' : 'mins'}
                                    </span>
                                    <span>·</span>
                                    <span>{getArrivalTime(option.pickup_eta)}</span>
                                </div>

                                <p className="text-[11px] mt-0.5 truncate" style={{ color: MUTED }}>{details.description}</p>
                            </div>

                            {/* Fare */}
                            <div className="text-right shrink-0 ml-3">
                                <p className="text-lg font-black tracking-tight" style={{ color: FG }}>
                                    ₹{option.fare.toFixed(0)}
                                </p>
                                <p className="text-[10px] font-medium" style={{ color: MUTED }}>estimated</p>
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
                        style={{ borderColor: 'hsl(169,59%,31%,0.15)' }}
                    >
                        <div className="flex items-center gap-3">
                            {/* Payment pill */}
                            <div
                                className="flex items-center gap-2 px-3 py-3 rounded-xl cursor-pointer transition-all shrink-0"
                                style={{
                                    background: 'var(--clr-primary-subtle)',
                                    border: '1px solid color-mix(in srgb, var(--clr-primary) 20%, transparent)',
                                }}
                            >
                                <Banknote className="w-4 h-4" style={{ color: PRIMARY }} />
                                <span className="font-bold text-sm" style={{ color: FG }}>Cash</span>
                                <ChevronDown className="w-3.5 h-3.5" style={{ color: MUTED }} />
                            </div>

                            {/* Request button */}
                            <motion.button
                                whileHover={{ scale: 1.02, y: -1 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => onRequest(selectedOption)}
                                className="flex-1 flex items-center justify-center gap-2 font-bold text-sm py-3.5 rounded-xl transition-all"
                                style={{
                                    background: `linear-gradient(135deg, ${PRIMARY}, hsl(169,59%,20%))`,
                                    boxShadow: '0 6px 24px hsl(169,59%,31%,0.35)',
                                    color: 'var(--clr-card)',
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