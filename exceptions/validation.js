const Base = require('./base');

module.exports = class Validation extends Base {
	constructor(message = 'Validation error') {
		super(422, message);
	}
};
