let accessToken = null;

export function get_token() {
    return accessToken
}

export function set_token(token) {
    accessToken = token;
}

export function clear_token() {
    accessToken = null;
}