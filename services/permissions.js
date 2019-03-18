const permissions = new Map();
const Validation = require('../exceptions/validation');

class Permissions {
    static async try(action, role, callback) {
        Validation.throwUnless(this.has(action, role));

        await callback();
    }

    static has(action, role) {
        return permissions.has(action) && permissions.get(action).includes(role);
    }

    static add(action, role) {
        if (permissions.has(action)) {
            permissions.push(role);
        } else {
            permissions.set([role]);
        }
    }
}

Permissions.add('device-add', 'Admin');

module.exports = Permissions;
