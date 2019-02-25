const Base = require('./base');

module.exports = class NotFound extends Base {
	constructor(message = 'Resource not found') {
		super(404, message);
	}
};
