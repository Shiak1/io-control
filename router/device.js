const router = require('express').Router();
const Device = require('../services/device');

const { Validation } = require('../exceptions');

router.get('/', async (request, response) => {
    const devices = (await Device.list()).map(device => device.data());

    response.send({ data: devices });
});

module.exports = router;
