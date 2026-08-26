import LocationInput from '../shared/ui/LocationInput';

export default function LocationInputGroup({
    extraClasses = "",
    containerRef,
    activeInput,
    setActiveInput,
    pickupCoords,
    setPickupCoords,
    dropCoords,
    setDropCoords,
    setSearchTriggered
}) {
    return (
        <div className={`space-y-2.5 relative ${extraClasses}`} ref={containerRef}>
            {/* Gradient connector line */}
            <div
                className="absolute left-[15px] top-[42px] bottom-[42px] w-[2px] rounded-full z-0"
                style={{ background: 'linear-gradient(to bottom, rgba(139,92,246,0.7), rgba(16,185,129,0.7))' }}
            />

            {/* Pickup input */}
            <div className={`relative ${activeInput === 'pickup' || activeInput === null ? 'z-20' : 'z-10'}`}>
                <LocationInput
                    placeholder="Pickup location"
                    initialValue={pickupCoords?.name || ""}
                    isActive={activeInput === 'pickup'}
                    onFocus={() => setActiveInput('pickup')}
                    onSelectLocation={(loc) => {
                        setPickupCoords(loc);
                        if (setSearchTriggered) setSearchTriggered(false);
                    }}
                    icon={
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{
                                background: 'rgba(139,92,246,0.9)',
                                boxShadow: '0 0 6px rgba(139,92,246,0.6)',
                            }}
                        />
                    }
                />
            </div>

            {/* Dropoff input */}
            <div className={`relative ${activeInput === 'dropoff' ? 'z-20' : 'z-10'}`}>
                <LocationInput
                    placeholder="Dropoff location"
                    initialValue={dropCoords?.name || ""}
                    isActive={activeInput === 'dropoff'}
                    onFocus={() => setActiveInput('dropoff')}
                    onSelectLocation={(loc) => {
                        setDropCoords(loc);
                        if (setSearchTriggered) setSearchTriggered(false);
                    }}
                    icon={
                        <div
                            className="w-3 h-3 rounded-md"
                            style={{
                                background: 'rgba(16,185,129,0.9)',
                                boxShadow: '0 0 6px rgba(16,185,129,0.5)',
                            }}
                        />
                    }
                />
            </div>
        </div>
    );
}
