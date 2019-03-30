const http = require('http');
const timeout = 10000;

module.exports = {
    get(url) {
        return new Promise((resolve, reject) => {
            const request = http.get(url, resolve).on('error', reject);

            request.on('socket', socket => {
                socket.setTimeout(timeout);

                socket.on('timeout', () => request.abort());
            });
        });
    },
};
