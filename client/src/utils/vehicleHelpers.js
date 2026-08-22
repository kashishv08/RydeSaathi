export const getArrivalTime = (etaMinutes) => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + Math.ceil(etaMinutes));
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
};

export const getConnectingTime = () => {
    return new Date(Date.now() + 5 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};