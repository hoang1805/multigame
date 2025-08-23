$(document).ready(function() {
    window.getAccessToken = function() {
        const cookies = document.cookie.split(';').reduce((acc, v) => {
            const [key, value] = v.trim().split('=');
            acc[key] = value;
            return acc;
        }, {});

        return cookies['accessToken'] ?? '';
    }
})