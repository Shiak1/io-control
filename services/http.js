const http = require('http');

module.exports = {
    get(url) {
        return new Promise((resolve, reject) => {
            http.get(url, resolve).on('error', reject);
        });
    },
};
