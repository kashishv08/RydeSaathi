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
                className="absolute left-[15.5px] top-[42px] bottom-[42px] w-[2px] rounded-full z-0"
                style={{ background: 'linear-gradient(to bottom, color-mix(in srgb, var(--clr-primary) 80%, transparent), color-mix(in srgb, var(--clr-accent) 50%, transparent))' }}
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
                            className="w-2.5 h-2.5 rounded-full"
                            style={{
                                background: 'var(--clr-primary)',
                                boxShadow: '0 0 10px 3px var(--clr-primary-subtle)',
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
                            className="w-2.5 h-2.5 rounded-[3px]"
                            style={{
                                background: 'var(--clr-accent)',
                                boxShadow: '0 0 10px 3px color-mix(in srgb, var(--clr-accent) 25%, transparent)',
                            }}
                        />
                    }
                />
            </div>
        </div>
    );
}
