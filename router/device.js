const router = require('express').Router();

const Permissions = require('../services/permissions');
const Device = require('../services/device');
const User = require('../services/user');

const { Validation } = require('../exceptions');

router.get('/', async ({ session: { user: { role, _id } } }, response) => {
	const devices =
		role == 'User'
			? (await User.findById(_id).populate('devices')).devices
			: (await Device.find()).map(device => device.data());

	response.send({ data: devices });
});

router.post(
	'/',
	async (
		{
			body: { controller, name, relay, group, type },
			session: {
				user: { role },
			},
		},
		response
	) => {
		try {
			await Permissions.try('add-device', role, async () => {
				const data = await new Device({ controller, name, relay, group, type }).save();

				response.send({ data });
			});
		} catch (error) {
			next(error);
		}
	}
);

router.post(
	'/:id/state',
	async (
		{
			body: { state },
			params: { id },
			session: {
				user: { username, fullName, _id },
			},
		},
		response,
		next
	) => {
		const device = await Device.findById(id);

		try {
			await device.state(state, { username, fullName, _id });

			response.end();
		} catch (error) {
			next(error);
		}
	}
);

module.exports = router;
