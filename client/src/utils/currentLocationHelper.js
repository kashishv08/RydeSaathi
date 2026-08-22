const LocationSender = () => {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            resolve({ error: "Geolocation is not supported by your browser." });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                resolve({ loc: { lat: latitude, lng: longitude } });
            },
            (err) => {
                resolve({ error: err.message });
            },
            { enableHighAccuracy: true, timeout: 15000 }
        );
    });
};

export default LocationSender;
