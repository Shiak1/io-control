const parser = require('cookie-parser');
const session = require('express-session');

const {
    auth: { secret },
} = require('../config.json');

exports.init = init;
exports.isAuthenticated = isAuthenticated;
exports.validate = validate;

function init(app) {
    app.use(parser());

    app.use(
        session({
            key: 'user-id',
            secret,
            resave: false,
            saveUninitialized: false,
            cookie: {
                expires: 600000,
            },
        })
    );

    app.use((request, response, next) => {
        const { cookies, session } = request;

        if (cookies['user-id'] && !session.user) {
            response.clearCookie('user-id');
        }

        next();
    });
}

function isAuthenticated(request) {
    const { cookies, session } = request;

    return cookies['user-id'] && session.user;
}

function isPublic({ path, method }) {
    const allowed = { '/api/authentication': 'POST' };

    return allowed[path] == method;
}

function validate(request, response, next) {
    if (isAuthenticated(request) || isPublic(request)) {
        next();
    } else {
        response.redirect('/login');
    }
}
