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

    get hierarchy() {
        return [];
    }

    get defaultView() {
        return this.all('views')[0];
    }

    all(key) {
        if (this.hierarchy.length) {
            return [...new Set(this[key].concat(...this.hierarchy.map(role => role.all(key))))];
        } else {
            return this[key];
        }
    }

    isAuthorized(path) {
        const [apiOrView, controller] = path.split('/').filter(v => !!v);

        if (apiOrView == 'api') {
            return this.all('resources').includes(controller);
        } else if (apiOrView) {
            return this.all('views').includes(apiOrView);
        } else {
            return true;
        }
    }
}

class Admin extends Role {
    get resources() {
        return ['controllers'];
    }

    get hierarchy() {
        return [new Manager()];
    }
}

class Manager extends Role {
    get views() {
        return ['users'];
    }

    get resources() {
        return ['user', 'log'];
    }

    get hierarchy() {
        return [new User()];
    }
}

class User extends Role {
    get views() {
        return ['devices'];
    }

    get resources() {
        return ['device', 'views', 'permissions'];
    }
}

const roles = new Map([['Admin', new Admin()], ['Manager', new Manager()], ['User', new User()]]);

module.exports = Role;
