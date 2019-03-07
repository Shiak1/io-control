const { Schema } = require('mongoose');

module.exports = new Schema({
    name: { type: String, required: true },
    relay: { type: String, required: true },
    controller: {
        ip: { type: String, required: true },
        name: { type: String, required: true }
    }
});
