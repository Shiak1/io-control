const router = require('express').Router();
const Log = require('../models/log');

router.get('/', async (request, response) => {
    response.send({
        data: await Log.find()
            .sort({ _id: -1 })
            .limit(10),
    });
});

module.exports = router;
