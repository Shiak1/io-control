const router = require('express').Router();

const http = require('http');
const { promisify } = require('util');

const get = promisify(http.get);

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

router.post('/:id/state', async ({ body: { state }, params: { id } }, response) => {
	const device = await Device.findById(id);

	let data = '';
	console.log(`http://${device.controller.ip}/state.xml?relay${device.relay}State=${state}`);
	try {
		const resp = await get(
			`http://${device.controller.ip}/state.xml?relay${device.relay}State=${state}`
		);
	} catch (error) {
		console.log(error);
	}

	response.end();
});

module.exports = router;
