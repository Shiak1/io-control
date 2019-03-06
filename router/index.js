const body = require('body-parser');
const express = require('express');

const { NotFound } = require('../exceptions');
const { errorHandler, authentication } = require('../middleware');

module.exports = (app, publicPath) => new Router(app, publicPath);

class Router {
    constructor(app, publicPath) {
        this.app = app;
        this.publicPath = publicPath;
        this.controllers = ['authentication', 'user'];

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

    setupViews() {
        this.app.get('/login', (request, response) => {
            this.authentication.checkRequest(
                request,
                () => response.redirect(request.session.user.homePage),
                () => this.respondWithHomePage(response)
            );
        });

        this.app.get('/', (request, response) => {
            this.authentication.checkRequest(
                request,
                () => response.redirect(request.session.user.homePage),
                () => response.redirect('/login')
            );
        });

        this.app.get('/users', (request, response) => {
            this.authentication.checkRequest(
                request,
                () => this.respondWithHomePage(response),
                () => response.redirect('/login')
            );
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
            this.authentication.checkRequest(
                request,
                () => next(),
                () => response.status(401).send({ message: 'Not authorized' })
            );
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
