const router = require('express').Router();

const Permissions = require('../services/permissions');

router.get('/:permission', ({ params: { permission }, session: { user: { role } } }, response) => {
    response.send({ data: Permissions.has(permission, role) });
});

module.exports = router;
