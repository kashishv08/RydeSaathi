import { useEffect, useRef, useState } from 'react';

const LOCATIONIQ_KEY = import.meta.env.VITE_LOCATIONIQ_KEY;

export default function StaticRouteMap({ pickup, drop, routeData }) {
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
                // If only pickup is provided, draw a simple black marker (used for Driver Dashboard)
                const popup = new window.maplibregl.Popup({
                    offset: 25,
                    closeButton: false,
                    closeOnClick: false
                }).setText('Hello, You are here!');

                const startMarker = new window.maplibregl.Marker({ color: "#000000" })
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

    }, [pickup, drop, routeData, isMapLoaded]);

    return (
        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full"></div>
    );
}
