export const getAvatarUrl = (name, isDriver = false) => {
    const seed = name || (isDriver ? 'Driver' : 'Rider');
    const bgHex = 'fff8e8';
    const textHex = isDriver ? '1f756d' : 'e57453';
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed)}&backgroundColor=${bgHex}&textColor=${textHex}`;
};
