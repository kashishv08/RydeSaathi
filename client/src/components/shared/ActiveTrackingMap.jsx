import { useEffect, useRef, useState } from 'react';
import { getDynamicEtaMins } from '../../utils/geoHelpers';

const LOCATIONIQ_KEY = import.meta.env.VITE_LOCATIONIQ_KEY;

export default function ActiveTrackingMap({ startPoint, endPoint, routeData, driverLocation, role, showEtaBadge = false, isCompleted = false }) {
    // startPoint: { lon, lat, name? }
    // endPoint: { lon, lat, name? }
    // role: "RIDER" | "DRIVER"

    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const markersRef = useRef([]);
    const driverMarkerRef = useRef(null);
    const etaBadgeRef = useRef(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    // Re-measure the map canvas whenever the container is resized
    // (e.g. after a Framer Motion opacity animation reveals the container)
    useEffect(() => {
        if (!mapContainerRef.current) return;
        const ro = new ResizeObserver(() => {
            if (mapRef.current) {
                mapRef.current.resize();
            }
        });
        ro.observe(mapContainerRef.current);
        return () => ro.disconnect();
    }, []);


    useEffect(() => {
        if (mapRef.current) return;
        if (!window.locationiq) return;
        window.locationiq.key = LOCATIONIQ_KEY;

        const center = driverLocation ? [driverLocation.lon, driverLocation.lat] : (startPoint ? [startPoint.lon, startPoint.lat] : [77.2090, 28.6139]);

        const map = new window.maplibregl.Map({
            container: mapContainerRef.current,
            style: window.locationiq.getLayer("Streets"),
            zoom: 14,
            center: center
        });

        map.on('load', () => { setIsMapLoaded(true); });
        mapRef.current = map;

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        }
    }, []);

    // Draw route and static markers
    useEffect(() => {
        const map = mapRef.current;
        if (!map || !isMapLoaded || !startPoint || !endPoint) return;

        // Clear existing route and markers
        if (map.getSource('route')) {
            map.removeLayer('route');
            map.removeSource('route');
        }
        markersRef.current.forEach(m => m.remove());
        markersRef.current = [];
        etaBadgeRef.current = null;

        if (isCompleted) {
            // Show only the pulsing radar at destination
            const radarEl = document.createElement('div');
            radarEl.className = 'relative flex justify-center items-center';
            radarEl.innerHTML = `
                <div class="absolute w-32 h-32 bg-blue-500 rounded-full animate-ping opacity-50"></div>
                <div class="relative w-8 h-8 bg-blue-600 rounded-full border-4 border-white shadow-xl flex items-center justify-center z-10">
                    <div class="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div class="absolute top-10 bg-black text-white px-4 py-2 rounded-lg font-bold text-sm shadow-xl whitespace-nowrap z-20">
                    Reached at ${endPoint.name || 'location'}
                </div>
            `;
            const radarMarker = new window.maplibregl.Marker({ element: radarEl })
                .setLngLat([endPoint.lon, endPoint.lat])
                .addTo(map);

            markersRef.current = [radarMarker];
            map.flyTo({ center: [endPoint.lon, endPoint.lat], zoom: 16 });
            return;
        }

        if (routeData) {
            map.addSource('route', {
                'type': 'geojson',
                'data': { 'type': 'Feature', 'properties': {}, 'geometry': routeData.geometry }
            });

            map.addLayer({
                'id': 'route',
                'type': 'line',
                'source': 'route',
                'layout': { 'line-join': 'round', 'line-cap': 'round' },
                'paint': { 'line-color': '#000000', 'line-width': 4 }
            });

            const durationMins = Math.ceil(routeData.durationSeconds / 60);

            if (role === 'DRIVER') {
                // Driver View: Show ETA badge on the destination, no start marker
                const endEl = document.createElement('div');
                endEl.className = 'flex items-center bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden cursor-pointer z-10';
                endEl.innerHTML = `
                    <div id="dynamic-eta-badge" class="bg-blue-600 text-white px-3 py-2 text-center text-sm font-bold leading-tight">
                        ${durationMins}<br/>min
                    </div>
                    <div class="px-4 py-2 font-semibold text-black whitespace-nowrap">
                        Heading to ${endPoint.name || 'Destination'}
                    </div>
                `;

                etaBadgeRef.current = endEl.querySelector('#dynamic-eta-badge');

                const endMarker = new window.maplibregl.Marker({ element: endEl, offset: [0, -20] })
                    .setLngLat([endPoint.lon, endPoint.lat])
                    .addTo(map);

                markersRef.current = [endMarker];
            } else {
                // Rider View: Show normal dots for start and end, AND driver UI badges if enabled
                const startEl = document.createElement('div');
                startEl.className = 'w-4 h-4 bg-black rounded-full border-4 border-white shadow-md z-10';
                const startMarker = new window.maplibregl.Marker({ element: startEl })
                    .setLngLat([startPoint.lon, startPoint.lat])
                    .addTo(map);

                let endEl = document.createElement('div');
                if (showEtaBadge) {
                    endEl.className = 'flex items-center bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden cursor-pointer z-20';
                    endEl.innerHTML = `
                        <div id="dynamic-eta-badge" class="bg-blue-600 text-white px-3 py-2 text-center text-sm font-bold leading-tight">
                            ${durationMins}<br/>min
                        </div>
                        <div class="px-4 py-2 font-semibold text-black whitespace-nowrap">
                            ${endPoint.name || 'Destination'}
                        </div>
                    `;
                    etaBadgeRef.current = endEl.querySelector('#dynamic-eta-badge');
                } else {
                    endEl.className = 'w-4 h-4 bg-white border-4 border-black rounded-sm shadow-md z-10';
                }

                const endMarker = new window.maplibregl.Marker({ element: endEl, offset: showEtaBadge ? [0, -20] : [0, 0] })
                    .setLngLat([endPoint.lon, endPoint.lat])
                    .addTo(map);

                markersRef.current = [startMarker, endMarker];
            }
        }

        const bounds = new window.maplibregl.LngLatBounds()
            .extend([startPoint.lon, startPoint.lat])
            .extend([endPoint.lon, endPoint.lat]);
        if (driverLocation) bounds.extend([driverLocation.lon, driverLocation.lat]);
        
        map.fitBounds(bounds, { padding: 50 });

    }, [startPoint, endPoint, routeData, isMapLoaded, role, showEtaBadge, isCompleted]);

    // Handle moving driver marker
    useEffect(() => {
        const map = mapRef.current;
        if (!map || !isMapLoaded || !driverLocation) return;

        if (isCompleted) {
            if (driverMarkerRef.current) {
                driverMarkerRef.current.remove();
                driverMarkerRef.current = null;
            }
            return;
        }

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
    }, [driverLocation, isCompleted]);

    // Update dynamic ETA text
    useEffect(() => {
        if (isCompleted || !etaBadgeRef.current || !driverLocation || !routeData || !endPoint) return;

        const dynamicMins = getDynamicEtaMins(driverLocation, endPoint, routeData.durationSeconds);
        etaBadgeRef.current.innerHTML = `${dynamicMins}<br/>min`;
    }, [driverLocation, routeData, endPoint, isCompleted]);

    return (
        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full"></div>
    );
}
