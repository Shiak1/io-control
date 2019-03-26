const http = require('http');
const timeout = 3000;

module.exports = {
    request(url, method) {
        return new Promise((resolve, reject) => {
            const request = http.request({ url, method }, resolve).on('error', reject);

            request.on('socket', socket => {
                socket.setTimeout(timeout);

                socket.on('timeout', () => request.abort());
            });
        });
    },

    get(url) {
        return this.request(url, 'GET');
    },
};
