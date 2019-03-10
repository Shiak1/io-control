const router = require('express').Router();

const Device = require('../services/device');

router.get('/', async (request, response) => {
	const data = await Device.find().distinct('controller');

	response.send({ data });
});

module.exports = router;
