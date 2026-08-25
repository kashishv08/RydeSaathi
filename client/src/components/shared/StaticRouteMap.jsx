import { useEffect, useRef, useState } from 'react';

const LOCATIONIQ_KEY = import.meta.env.VITE_LOCATIONIQ_KEY;

export default function StaticRouteMap({ pickup, drop, routeData, isOnline }) {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const markersRef = useRef([]);
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    useEffect(() => {
        if (mapRef.current) return;
        if (!window.locationiq) return;

        window.locationiq.key = LOCATIONIQ_KEY;

        const map = new window.maplibregl.Map({
            container: mapContainerRef.current,
            style: window.locationiq.getLayer("Streets"),
            zoom: 13,
            center: pickup ? [pickup.lon, pickup.lat] : [77.2090, 28.6139]
        });

        map.on('load', () => {
            setIsMapLoaded(true);
        });

        mapRef.current = map;

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        }
    }, []);

    // Draw route and markers
    useEffect(() => {
        const map = mapRef.current;
        if (!map || !isMapLoaded) return;

        const updateMap = () => {
            // Always clear existing route and markers before redrawing
            if (map.getSource('route')) {
                map.removeLayer('route');
                map.removeSource('route');
            }
            markersRef.current.forEach(m => m.remove());
            markersRef.current = [];

            if (!pickup) return;

            if (!drop) {
                // If only pickup is provided, draw a custom marker (used for Driver Dashboard)
                const el = document.createElement('div');
                el.className = 'relative flex flex-col items-center justify-center -top-6';
                
                let radarHtml = '';
                if (isOnline) {
                    radarHtml = `
                        <div class="absolute top-[45px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-black/15 rounded-full animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] pointer-events-none"></div>
                        <div class="absolute top-[45px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-black/20 rounded-full animate-pulse pointer-events-none"></div>
                    `;
                }

                el.innerHTML = `
                    <div class="relative z-10 flex flex-col items-center drop-shadow-xl">
                        <svg width="34" height="50" viewBox="0 0 27 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.5 0C6.04416 0 0 6.04416 0 13.5C0 23.625 13.5 41 13.5 41C13.5 41 27 23.625 27 13.5C27 6.04416 20.9558 0 13.5 0Z" fill="black"/>
                            <circle cx="13.5" cy="13.5" r="5" fill="white"/>
                        </svg>
                    </div>
                    ${radarHtml}
                `;

                const popup = new window.maplibregl.Popup({
                    offset: [0, -40],
                    closeButton: false,
                    closeOnClick: false,
                    className: 'custom-popup-class'
                }).setHTML('<div class="font-bold text-sm px-2 py-1 text-center">Hello, You are here!</div>');

                const startMarker = new window.maplibregl.Marker({ element: el })
                    .setLngLat([pickup.lon, pickup.lat])
                    .setPopup(popup)
                    .addTo(map);

                markersRef.current = [startMarker];
                map.panTo([pickup.lon, pickup.lat]);
                startMarker.togglePopup();
                return;
            }

            // If we have routeData, draw the full route
            if (routeData) {
                const geometry = routeData.geometry;
                const durationMins = Math.ceil(routeData.durationSeconds / 60);

                map.addSource('route', {
                    'type': 'geojson',
                    'data': { 'type': 'Feature', 'properties': {}, 'geometry': geometry }
                });

                map.addLayer({
                    'id': 'route',
                    'type': 'line',
                    'source': 'route',
                    'layout': { 'line-join': 'round', 'line-cap': 'round' },
                    'paint': { 'line-color': '#000000', 'line-width': 4 }
                });

                const startEl = document.createElement('div');
                startEl.className = 'flex items-center bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden cursor-pointer z-10';
                startEl.innerHTML = `
                    <div class="bg-black text-white px-3 py-2 text-center text-sm font-bold leading-tight">
                        ${durationMins}<br/>min
                    </div>
                    <div class="px-4 py-2 font-semibold text-black whitespace-nowrap">
                        From ${pickup.name || "Pickup"} &gt;
                    </div>
                `;
                const startMarker = new window.maplibregl.Marker({ element: startEl, offset: [0, -20] })
                    .setLngLat([pickup.lon, pickup.lat])
                    .addTo(map);

                const endEl = document.createElement('div');
                endEl.className = 'bg-white border border-gray-200 rounded-lg shadow-md px-4 py-2 font-semibold text-black whitespace-nowrap cursor-pointer z-10';
                endEl.innerHTML = `To ${drop.name || "Dropoff"} &gt;`;

                const endMarker = new window.maplibregl.Marker({ element: endEl, offset: [0, -20] })
                    .setLngLat([drop.lon, drop.lat])
                    .addTo(map);

                markersRef.current = [startMarker, endMarker];
            } else {
                // No route data yet, just draw simple dots
                const startEl = document.createElement('div');
                startEl.className = 'w-4 h-4 bg-black rounded-full border-4 border-white shadow-md z-10';
                const startMarker = new window.maplibregl.Marker({ element: startEl })
                    .setLngLat([pickup.lon, pickup.lat])
                    .addTo(map);

                const endEl = document.createElement('div');
                endEl.className = 'w-4 h-4 bg-white border-4 border-black rounded-sm shadow-md z-10';
                const endMarker = new window.maplibregl.Marker({ element: endEl })
                    .setLngLat([drop.lon, drop.lat])
                    .addTo(map);

                markersRef.current = [startMarker, endMarker];
            }

            // Fit bounds
            const bounds = new window.maplibregl.LngLatBounds()
                .extend([pickup.lon, pickup.lat])
                .extend([drop.lon, drop.lat]);
            map.fitBounds(bounds, { padding: 100 });
        };
        updateMap();

    }, [pickup, drop, routeData, isMapLoaded, isOnline]);

    return (
        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full"></div>
    );
}
