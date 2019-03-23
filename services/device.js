const mongoose = require('mongoose');
const Model = require('./model');
const schema = require('../models/device');
const tap = require('../utils/tap');
const Log = require('../models/log');
const http = require('./http');

class Device extends Model {
	async log(state, user, error) {
		await new Log({ state, user, device: this.data(), error }).save();
	}

	async state(state, user) {
		const url = `http://${this.controller.ip}/state.xml?relay${this.relay}State=${state}`;

		let error;

		try {
			await http.get(url);
		} catch (e) {
			error = e;
			state = null;
		} finally {
			await this.log(state, user, error);
		}
	}
}

schema.loadClass(Device);

module.exports = mongoose.model('Device', schema);
