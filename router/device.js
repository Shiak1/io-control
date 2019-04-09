const router = require('express').Router();

const Permissions = require('../services/permissions');
const Device = require('../services/device');
const User = require('../services/user');

const { Validation, Unauthenticated, Unauthorized } = require('../exceptions');

async function getUserDevices(id) {
    const user = await User.findById(id).populate('devices groups');

    Validation.throwUnless(user);

    return await user.access();
}

router.get('/', async ({ session: { user: { role, _id } } }, response, next) => {
    try {
        const devices =
            role == 'User'
                ? await getUserDevices(_id)
                : (await Device.find()).map(device => device.data());

        response.send({ data: devices });
    } catch (error) {
        next(error);
    }
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
        response,
        next
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

router.put(
    '/:id',
    async (
        {
            body: { name, group, type },
            session: {
                user: { role },
            },
            params: { id },
        },
        response,
        next
    ) => {
        try {
            await Permissions.try('add-device', role, async () => {
                const device = await Device.findById(id);

                Validation.throwUnless(device);

                Object.assign(device, { name, group, type });

                await device.save();

                response.send({ data: device });
            });
        } catch (error) {
            next(error);
        }
    }
);

router.delete('/:id', async ({ session: { user: { role } }, params: { id } }, response) => {
    try {
        await Permissions.try('add-device', role, async () => {
            const device = await Device.findById(id);

            Validation.throwUnless(device);

            await device.remove();

            response.send({ data: device });
        });
    } catch (error) {
        next(error);
    }
});

router.post(
    '/:id/state',
    async (
        {
            body: { state },
            params: { id },
            session: {
                user: { username, fullName, _id, role },
            },
        },
        response,
        next
    ) => {
        const user = await User.findById(_id);

        Unauthenticated.throwUnless(user);

        const device = await Device.findById(id).populate('devices groups');

        Unauthorized.throwUnless(user.allowedOnDevice(device));

        await device.state(state, { username, fullName, _id });

        response.end();
    }
);

module.exports = router;
