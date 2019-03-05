const cookieParser = require('cookie-parser');
const session = require('express-session');

const {
    auth: { secret },
} = require('../config.json');

module.exports = app => new Authentication(app);

class Exposed {
    constructor() {
        this.gates = {};
    }

    expose(gate, door) {
        if (this.gates[gate]) {
            this.gates[gate].add(door);
        } else {
            this.gates[gate] = new Set([door]);
        }
    }

    has(gate, door) {
        return this.gates[gate] && this.gates[gate].has(door);
    }
}

class Authentication {
    constructor(app) {
        this.app = app;
        this.exposed = new Exposed();

        this.parseCookies();
        this.setupSessions();
        this.reconcileCookies();
    }

    parseCookies() {
        this.app.use(cookieParser());
    }

    setupSessions() {
        const userSession = session({
            key: 'user-id',
            secret,
            resave: false,
            saveUninitialized: false,
            cookie: {
                expires: 600000,
            },
        });

        this.app.use(userSession);
    }

    reconcileCookies() {
        this.app.use((request, response, next) => {
            const { cookies, session } = request;

            if (cookies['user-id'] && !session.user) {
                response.clearCookie('user-id');
            }

            next();
        });
    }

    expose(path, method) {
        this.exposed.expose(path, method);
    }

    isExposed({ path, method }) {
        return this.exposed.has(path, method);
    }

    isAuthenticated({ cookies, session }) {
        return cookies['user-id'] && session.user;
    }

    checkRequest(request, passed, failed) {
        if (this.isExposed(request) || this.isAuthenticated(request)) {
            passed();
        } else {
            failed();
        }
    }
}
