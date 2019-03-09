const body = require('body-parser');
const express = require('express');

const Role = require('../services/role');
const { NotFound, Unauthenticated, Unauthorized } = require('../exceptions');
const { errorHandler, authentication } = require('../middleware');

module.exports = (app, publicPath) => new Router(app, publicPath);

class Router {
    constructor(app, publicPath) {
        this.app = app;
        this.publicPath = publicPath;
        this.controllers = ['authentication', 'user', 'device'];

        this.authentication = authentication(app);

        this.setupBodyParser();
        this.setupViews();
        this.exposePublicPaths();
        this.injectAuth();
        this.setupApi();
        this.handleErrors();
    }

    setupBodyParser() {
        this.app.use(body.urlencoded({ extended: false }));
        this.app.use(body.json());
    }

    respondWithHomePage(response) {
        response.sendFile(this.publicPath + '/index.html');
    }

    getUserRole({
        session: {
            user: { role },
        },
    }) {
        return Role.get(role);
    }

    getDefaultView(request) {
        return '/' + this.getUserRole(request).defaultView;
    }

    setupViews() {
        this.app.get('/login', (request, response) => {
            try {
                this.authentication.checkRequest(request);

                response.redirect(this.getDefaultView(request));
            } catch (error) {
                Unauthenticated.handle(error, () => this.respondWithHomePage(response));
            }
        });

        this.app.get('/', (request, response) => {
            try {
                this.authentication.checkRequest(request);

                response.redirect(this.getDefaultView(request));
            } catch (error) {
                Unauthenticated.handle(error, () => response.redirect('/login'));
            }
        });

        this.app.get('/users|devices', (request, response) => {
            try {
                this.authentication.checkRequest(request);

                this.respondWithHomePage(response);
            } catch (error) {
                Unauthenticated.handle(error, () => response.redirect('/login'));
                Unauthorized.handle(error, () => response.redirect(this.getDefaultView(request)));
            }
        });

        this.app.post('/logout', (request, response) => {
            response.clearCookie('user-id');

            response.redirect('/login');
        });

        this.app.use('/', express.static(this.publicPath));
    }

    exposePublicPaths() {
        this.authentication.expose('/api/authentication', 'POST');
    }

    injectAuth() {
        this.app.use((request, response, next) => {
            try {
                this.authentication.checkRequest(request);

                next();
            } catch (error) {
                Unauthenticated.handle(error, () =>
                    response.status(401).send({ message: 'Not logged in' })
                );
                Unauthorized.handle(error, () =>
                    response.status(403).send({ message: 'Unauthorized' })
                );
            }
        });
    }

    setupApi() {
        this.controllers.forEach(controller => {
            this.app.use('/api/' + controller, require('./' + controller));
        });

        this.app.use('/api/*', (request, response, next) => {
            next(new NotFound());
        });
    }

    handleErrors() {
        this.app.use(errorHandler);
    }
}
