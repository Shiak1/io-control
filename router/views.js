const router = require('express').Router();

const Role = require('../services/role');

router.get('/', async ({ session: { user: { role } } }, response) => {
	const data = Role.get(role).all('views');

	response.send({ data });
});

module.exports = router;
