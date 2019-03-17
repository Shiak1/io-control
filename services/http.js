const http = require('http');
const { promisify } = require('util');

const get = promisify(http.get);

module.exports = {
	get(url) {
		return await get(url);
	}
}
