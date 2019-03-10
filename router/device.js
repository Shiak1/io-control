const router = require('express').Router();
const Device = require('../services/device');

const { Validation } = require('../exceptions');

router.get('/', async (request, response) => {
	const devices = (await Device.find()).map(device => device.data());

	response.send({ data: devices });
});

router.post('/', async ({ body: { controller, name, relay, group, type } }, response) => {
	await new Device({ controller, name, relay, group, type }).save();

	response.end();
});

module.exports = router;
