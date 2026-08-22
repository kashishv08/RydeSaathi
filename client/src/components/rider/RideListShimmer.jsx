import React from 'react';

export default function RideListShimmer() {
    return (
        <div className="flex flex-col mt-4 flex-1 animate-pulse">
            {/* Shimmer for the heading */}
            <div className="w-48 h-8 bg-gray-200 rounded-md mb-6"></div>

            <div className="flex flex-col space-y-3 mb-4">
                {[1, 2, 3].map((item) => (
                    <div
                        key={item}
                        className="flex items-center justify-between p-3 rounded-2xl border-[3px] border-transparent"
                    >
                        <div className="flex items-center space-x-3 w-[70%]">
                            {/* Car image shimmer */}
                            <div className="w-20 h-12 bg-gray-200 rounded-md shrink-0"></div>

                            <div className="flex flex-col flex-1 space-y-2">
                                {/* Title and icons shimmer */}
                                <div className="w-32 h-5 bg-gray-200 rounded-md"></div>
                                {/* ETA shimmer */}
                                <div className="w-24 h-4 bg-gray-200 rounded-md"></div>
                                {/* Description shimmer */}
                                <div className="w-40 h-3 bg-gray-200 rounded-md"></div>
                            </div>
                        </div>

                        {/* Price shimmer */}
                        <div className="w-16 h-6 bg-gray-200 rounded-md text-right shrink-0"></div>
                    </div>
                ))}
            </div>

            {/* Bottom action bar shimmer */}
            <div className="sticky bottom-0 bg-white pt-2 pb-2 mt-auto z-10">
                <div className="flex items-center justify-between gap-4">
                    <div className="w-1/3 h-14 bg-gray-200 rounded-xl"></div>
                    <div className="flex-1 h-14 bg-gray-200 rounded-xl"></div>
                </div>
            </div>
        </div>
    );
}
