const router = require('express').Router();

const Device = require('../services/device');

const { Validation } = require('../exceptions');

router.get('/', async (request, response) => {
    const devices = (await Device.find()).map(device => device.data());

    response.send({ data: devices });
});

router.post('/', async ({ body: { controller, name, relay, group, type } }, response) => {
    const data = await new Device({ controller, name, relay, group, type }).save();

    response.send({ data });
});

router.post(
    '/:id/state',
    async ({ body: { state }, params: { id }, session: { user } }, response, next) => {
        const device = await Device.findById(id);

        try {
            await device.state(state, user);

            response.end();
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;
