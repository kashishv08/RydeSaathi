import React from 'react';

// Shimmer base color tokens
const CARD_BG = 'rgba(255,255,255,0.03)';
const CARD_BORDER = '1.5px solid rgba(255,255,255,0.07)';
const SLAB_BASE = 'rgba(255,255,255,0.06)';
const SLAB_HIGHLIGHT = 'rgba(139,92,246,0.12)';

function ShimmerSlab({ w = 'w-full', h = 'h-4', rounded = 'rounded-lg' }) {
    return (
        <div
            className={`${w} ${h} ${rounded} overflow-hidden relative`}
            style={{ background: SLAB_BASE }}
        >
            <div
                className="absolute inset-0"
                style={{
                    background: `linear-gradient(90deg, transparent 0%, ${SLAB_HIGHLIGHT} 50%, transparent 100%)`,
                    backgroundSize: '200% 100%',
                    animation: 'shimmer-sweep 1.6s ease-in-out infinite',
                }}
            />
        </div>
    );
}

export default function RideListShimmer() {
    return (
        <>
            <style>{`
                @keyframes shimmer-sweep {
                    0%   { background-position: -200% 0; }
                    100% { background-position:  200% 0; }
                }
            `}</style>

            <div className="flex flex-col flex-1 gap-2">
                {/* Label slab */}
                <ShimmerSlab w="w-28" h="h-2.5" rounded="rounded-full" />

                {/* Three ride-card shimmers */}
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className="flex items-center gap-3 p-3.5 rounded-2xl"
                        style={{
                            background: CARD_BG,
                            border: CARD_BORDER,
                            opacity: 1 - i * 0.15,
                        }}
                    >
                        {/* Vehicle image slab */}
                        <ShimmerSlab w="w-20" h="h-12" rounded="rounded-xl" />

                        {/* Info slabs */}
                        <div className="flex flex-col gap-2 flex-1">
                            <div className="flex items-center gap-2">
                                <ShimmerSlab w="w-24" h="h-4" rounded="rounded-md" />
                                <ShimmerSlab w="w-10" h="h-4" rounded="rounded-full" />
                            </div>
                            <ShimmerSlab w="w-32" h="h-3" rounded="rounded-md" />
                            <ShimmerSlab w="w-40" h="h-2.5" rounded="rounded-md" />
                        </div>

                        {/* Fare slab */}
                        <div className="flex flex-col items-end gap-1 shrink-0">
                            <ShimmerSlab w="w-14" h="h-5" rounded="rounded-md" />
                            <ShimmerSlab w="w-10" h="h-2.5" rounded="rounded-md" />
                        </div>
                    </div>
                ))}

                {/* Bottom CTA bar shimmer */}
                <div
                    className="mt-3 pt-3 flex items-center gap-3 border-t"
                    style={{ borderColor: 'rgba(139,92,246,0.15)' }}
                >
                    <ShimmerSlab w="w-24" h="h-12" rounded="rounded-xl" />
                    <ShimmerSlab w="w-full" h="h-12" rounded="rounded-xl" />
                </div>
            </div>
        </>
    );
}
