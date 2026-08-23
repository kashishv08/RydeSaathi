import { useEffect, useRef, useState } from 'react';
import { getDynamicEtaMins } from '../../utils/geoHelpers';

const LOCATIONIQ_KEY = import.meta.env.VITE_LOCATIONIQ_KEY;

export default function RideMap({ pickup, drop, routeData, driverLocation }) {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const markersRef = useRef([]);
    const driverMarkerRef = useRef(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    const etaBadgeRef = useRef(null);

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
            etaBadgeRef.current = null;

            // If no coordinates, just leave it cleared
            if (!pickup || !drop) return;

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

                if (pickup.isDriver) {
                    // Do not render a start marker (the blue car is the start!)
                    // Render the end marker (pickup point) with the ETA
                    const endEl = document.createElement('div');
                    endEl.className = 'flex items-center bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden cursor-pointer z-10';
                    endEl.innerHTML = `
                        <div id="dynamic-eta-badge" class="bg-blue-600 text-white px-3 py-2 text-center text-sm font-bold leading-tight">
                            ${durationMins}<br/>min
                        </div>
                        <div class="px-4 py-2 font-semibold text-black whitespace-nowrap">
                            Arriving at Pickup
                        </div>
                    `;

                    etaBadgeRef.current = endEl.querySelector('#dynamic-eta-badge');

                    const endMarker = new window.maplibregl.Marker({ element: endEl, offset: [0, -20] })
                        .setLngLat([drop.lon, drop.lat])
                        .addTo(map);

                    markersRef.current = [endMarker];
                } else {
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
                }
            } else {
                // No route data, just draw simple dots
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

    useEffect(() => {
        const map = mapRef.current;
        if (!map || !driverLocation) return;

        if (!driverMarkerRef.current) {
            const carEl = document.createElement('div');
            carEl.className = 'w-12 h-12 z-20 transition-all duration-500';
            carEl.style.backgroundImage = 'url(/car.png)';
            carEl.style.backgroundSize = 'contain';
            carEl.style.backgroundRepeat = 'no-repeat';
            carEl.style.backgroundPosition = 'center';

            driverMarkerRef.current = new window.maplibregl.Marker({ element: carEl })
                .setLngLat([driverLocation.lon, driverLocation.lat])
                .addTo(map);
        } else {
            driverMarkerRef.current.setLngLat([driverLocation.lon, driverLocation.lat]);
        }
    }, [driverLocation]);

    useEffect(() => {
        if (!pickup || !drop || !driverLocation || !routeData || !pickup.isDriver || !etaBadgeRef.current) return;

        const dynamicMins = getDynamicEtaMins(driverLocation, drop, routeData.durationSeconds);
        etaBadgeRef.current.innerHTML = `${dynamicMins}<br/>min`;

    }, [driverLocation, pickup, drop, routeData]);

    return (
        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full"></div>
    );
}
