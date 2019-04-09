const router = require('express').Router();
const User = require('../services/user');

const { Validation } = require('../exceptions');

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
            session: {
                user: { id: currentUser },
            },
            params: { id },
            body: { fullName, password, devices, deviceGroups },
        } = request;

        const update = {
            id,
            password,
            fullName,
            devices,
            deviceGroups,
        };

        const user = await User.findOrFail(id);

        Validation.throwIf(user.role == 'Admin' && id != currentUser);

        response.send({ data: (await User.update(update)).data() });
    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.post('/', async (request, response, next) => {
    try {
        const {
            body: { fullName, password, username, role },
        } = request;

        response.send({
            data: (await User.create({ fullName, password, username, role })).data(),
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
