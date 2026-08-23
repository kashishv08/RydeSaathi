import haversine from 'haversine-distance';

const AVG_SPEED_KMPH = 25;

export const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const pointA = { latitude: lat1, longitude: lon1 };
    const pointB = { latitude: lat2, longitude: lon2 };
    const distanceInMeters = haversine(pointA, pointB);
    return Math.round((distanceInMeters / 1000) * 100) / 100;
};

export const calculateEtaMinutes = (distanceKm) => {
    const etaMins = (distanceKm / AVG_SPEED_KMPH) * 60;
    return Math.ceil(etaMins);
};

export const getDynamicEtaMins = (driverLocation, drop, originalDurationSeconds) => {
    const currentDist = getDistanceFromLatLonInKm(driverLocation.lat, driverLocation.lon, drop.lat, drop.lon);

    if (currentDist < 0.05) return 1;

    let dynamicMins = calculateEtaMinutes(currentDist);
    if (dynamicMins < 1) dynamicMins = 1;

    if (originalDurationSeconds) {
        const originalMins = Math.ceil(originalDurationSeconds / 60);
        dynamicMins = Math.min(dynamicMins, originalMins);
    }

    return dynamicMins;
};
