const tap = require('../utils/tap');
const { Validation } = require('../exceptions');

class Role {
    static get(name) {
        return tap(roles.get(name), role => Validation.throwUnless(role, 'Invalid role'));
    }

    static isAuthorized(role, path) {
        return this.get(role).isAuthorized(path);
    }

    get views() {
        return [];
    }

    get resources() {
        return [];
    }

    get defaultView() {
        return this.views[0];
    }

    isAuthorized(path) {
        const [apiOrView, controller] = path.split('/').filter(v => !!v);

        if (apiOrView == 'api') {
            return this.resources.includes(controller);
        } else if (apiOrView) {
            return this.views.includes(apiOrView);
        } else {
            return true;
        }
    }
}

class Admin extends Role {
    get views() {
        return ['users', 'devices'];
    }

    get resources() {
        return ['user', 'device', 'controllers'];
    }
}

class Manager extends Admin {
    get resources() {
        return ['user', 'device'];
    }
}

class User extends Role {
    get views() {
        return ['devices'];
    }

    get resources() {
        return ['device'];
    }
}

const roles = new Map([['Admin', new Admin()], ['Manager', new Manager()], ['User', new User()]]);

module.exports = Role;
