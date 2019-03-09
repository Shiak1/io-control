const { Schema } = require('mongoose');

module.exports = new Schema({
	name: { type: String, required: true },
	group: String,
	relay: { type: String, required: true },
	type: { type: String, enum: ['Door', 'Elevator'], required: true },
	controller: {
		ip: { type: String, required: true },
		name: { type: String, required: true },
	},
});
