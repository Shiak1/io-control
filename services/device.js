const mongoose = require('mongoose');
const Model = require('./model');
const schema = require('../models/device');
const tap = require('../utils/tap');
const Log = require('../models/log');
const http = require('http');

class Device extends Model {
    log(state, user) {
        await new Log({ state, user, device: this.data() }).save();
    }

    state(state, user) {
        const url = `http://${this.controller.ip}/state.xml?relay${this.relay}State=${state}`;

        await http.get(url);

        await this.log(state, user);
    }
}

schema.loadClass(Device);

module.exports = mongoose.model('Device', schema);
