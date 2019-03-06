const Base = require('./base');

module.exports = class Unauthenticated extends Base {
    constructor(message = 'Unauthorized') {
        super(403, message);
    }
};
