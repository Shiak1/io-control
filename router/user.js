const router = require('express').Router();
const User = require('../services/user');

router.get('/', async (request, response) => {
    const users = (await User.list()).map(user => user.data());

    response.send({ data: users });
});

router.delete('/:id', async (request, response, next) => {
    try {
        await User.delete(request.params.id);

        response.end();
    } catch (error) {
        next(error);
    }
});

router.put('/:id', async (request, response, next) => {
    try {
        const {
            params: { id },
            body: { fullName, password },
        } = request;

        const update = {
            id,
            password,
            fullName,
        };

        response.send({ data: (await User.update(update)).data() });
    } catch (error) {
        next(error);
    }
});

router.post('/', async (request, response, next) => {
    try {
        const {
            body: { fullName, password, username },
        } = request;

        response.send({
            data: (await User.create({ fullName, password, username })).data(),
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
