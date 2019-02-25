const body = require('body-parser');
const express = require('express');

const { NotFound } = require('../exceptions');
const { errorHandler, authentication } = require('../middleware');
const controllers = ['authentication'];

module.exports = function(app, publicPath) {
    app.use(body.urlencoded({ extended: false }));
    app.use(body.json());

    authentication.init(app);

    const loader = response => response.sendFile(publicPath + '/index.html');

    app.get('/login', (request, response) => loadLoginView(request, response, loader));
    app.get('/', (request, response) => loadView(request, response, loader));

    app.post('/logout', (request, response) => {
        response.clearCookie('user-id');

        response.redirect('/login');
    });

    app.use('/', express.static(publicPath));

    app.use(authentication.validate);

    controllers.forEach(controller => {
        app.use('/api/' + controller, require('./' + controller));
    });

    app.use('/api/*', (request, response, next) => {
        next(new NotFound());
    });

    app.use('/*', (request, response) => loadView(request, response, loader));

    app.use(errorHandler);
};

function loadView(request, response, loader) {
    if (authentication.isAuthenticated(request)) {
        loader(response);
    } else {
        response.redirect('/login');
    }
}

function loadLoginView(request, response, loader) {
    if (authentication.isAuthenticated(request)) {
        response.redirect('/');
    } else {
        loader(response);
    }
}
