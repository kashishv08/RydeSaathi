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
        <div className={`space-y-3 relative ${extraClasses}`} ref={containerRef}>
            <div className="absolute left-[20px] top-10 bottom-10 w-0.5 bg-black z-0"></div>
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
                />
            </div>
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
                />
            </div>
        </div>
    );
}
