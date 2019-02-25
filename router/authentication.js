const router = require('express').Router();
const authentication = require('../services/authentication');
const Unauthenticated = require('../exceptions/unauthenticated');

router.post('/', async (request, response, next) => {
    const {
        body: { username, password },
    } = request;

    try {
        request.session.user = await authentication({ username, password });

        response.redirect('/');
    } catch (error) {
        next(new Unauthenticated());
    }
});

module.exports = router;
