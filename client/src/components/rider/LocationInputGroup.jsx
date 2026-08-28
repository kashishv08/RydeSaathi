import { MapPin, ArrowUpDown } from 'lucide-react';
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
    const handleSwap = () => {
        const tempCoords = pickupCoords;
        setPickupCoords(dropCoords);
        setDropCoords(tempCoords);
        if (setSearchTriggered) setSearchTriggered(false);
    };

    return (
        <div
            className={`relative ${extraClasses}`}
            ref={containerRef}
            style={{
                background: 'var(--clr-card)',
                border: '1px solid var(--clr-border)',
                borderRadius: '1.25rem',
                boxShadow: '0 4px 24px rgba(23,56,60,0.08)',
                padding: '6px 8px',
            }}
        >
            {/* Pickup row */}
            <div className={`relative transition-all duration-200 ${activeInput === 'pickup' || activeInput === null ? 'z-20' : 'z-10'}`}>
                {/* Pulsing dot icon */}
                <div
                    className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center z-10 pointer-events-none"
                    style={{ width: 28, height: 28 }}
                >
                    <span
                        style={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            background: 'var(--clr-primary)',
                            display: 'block',
                            boxShadow: '0 0 0 3px color-mix(in srgb, var(--clr-primary) 18%, transparent)',
                        }}
                    />
                </div>

                <LocationInput
                    placeholder="Pickup location"
                    initialValue={pickupCoords?.name || ""}
                    isActive={activeInput === 'pickup'}
                    onFocus={() => setActiveInput('pickup')}
                    onSelectLocation={(loc) => {
                        setPickupCoords(loc);
                        if (setSearchTriggered) setSearchTriggered(false);
                    }}
                    icon={<span className="w-4 h-4 opacity-0 pointer-events-none" />}
                />
            </div>

            {/* Divider + swap button */}
            <div className="relative flex items-center px-3 my-[-2px]" style={{ zIndex: 30 }}>
                <div
                    style={{
                        flex: 1,
                        height: 1,
                        borderTop: '1.5px dashed color-mix(in srgb, var(--clr-border) 80%, transparent)',
                        marginLeft: 6,
                    }}
                />

                <button
                    type="button"
                    onClick={handleSwap}
                    title="Swap pickup and dropoff"
                    style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: 'var(--clr-bg)',
                        border: '1.5px solid var(--clr-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'background 0.18s, border-color 0.18s, transform 0.22s',
                        flexShrink: 0,
                        margin: '0 8px',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = 'color-mix(in srgb, var(--clr-primary) 10%, transparent)';
                        e.currentTarget.style.borderColor = 'var(--clr-primary)';
                        e.currentTarget.style.transform = 'rotate(180deg)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = 'var(--clr-bg)';
                        e.currentTarget.style.borderColor = 'var(--clr-border)';
                        e.currentTarget.style.transform = 'rotate(0deg)';
                    }}
                >
                    <ArrowUpDown style={{ width: 13, height: 13, color: 'var(--clr-primary)' }} />
                </button>

                <div
                    style={{
                        flex: 1,
                        height: 1,
                        borderTop: '1.5px dashed color-mix(in srgb, var(--clr-border) 80%, transparent)',
                        marginRight: 6,
                    }}
                />
            </div>

            {/* Dropoff row */}
            <div className={`relative transition-all duration-200 ${activeInput === 'dropoff' ? 'z-20' : 'z-10'}`}>
                {/* MapPin icon */}
                <div
                    className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center z-10 pointer-events-none"
                    style={{ width: 28, height: 28 }}
                >
                    <MapPin
                        style={{
                            width: 13,
                            height: 13,
                            color: 'var(--clr-accent)',
                            fill: 'color-mix(in srgb, var(--clr-accent) 18%, transparent)',
                        }}
                    />
                </div>

                <LocationInput
                    placeholder="Dropoff location"
                    initialValue={dropCoords?.name || ""}
                    isActive={activeInput === 'dropoff'}
                    onFocus={() => setActiveInput('dropoff')}
                    onSelectLocation={(loc) => {
                        setDropCoords(loc);
                        if (setSearchTriggered) setSearchTriggered(false);
                    }}
                    icon={<span className="w-4 h-4 opacity-0 pointer-events-none" />}
                />
            </div>
        </div>
    );
}
