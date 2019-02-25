const Base = require('./base');

module.exports = class Unauthenticated extends Base {
	constructor(message = 'Invalid username or password') {
		super(401, message);
	}
};
