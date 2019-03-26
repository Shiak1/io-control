const cookieParser = require('cookie-parser');
const session = require('express-session');

const Store = require('connect-mongo')(session);

const store = new Store({
    mongooseConnection: require('mongoose').connection,
});

const Role = require('../services/role');
const { Unauthorized, Unauthenticated } = require('../exceptions');

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
            store,
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

    isAuthorized({
        session: {
            user: { role },
        },
        path,
    }) {
        return Role.isAuthorized(role, path);
    }

    checkRequest(request, passed, failed) {
        if (this.isExposed(request)) return;

        if (this.isAuthenticated(request)) {
            Unauthorized.throwUnless(this.isAuthorized(request));
        } else {
            throw new Unauthenticated('Not logged in');
        }
    }
}
