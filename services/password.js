const { Unauthenticated, Validation } = require('../exceptions');

const { promisify } = require('util');
const bcrypt = require('bcryptjs');

const {
    auth: { requirement },
} = require('../config.json');

module.exports = class Password {
    constructor(password) {
        Validation.throwUnless(new RegExp(requirement).test(password));

        this.password = password;
    }

    async hash() {
        return promisify(bcrypt.hash)(this.password, 10);
    }

    async authenticate(hash) {
        Unauthenticated.throwUnless(
            await promisify(bcrypt.compare)(this.password, hash),
        );
    }
};
