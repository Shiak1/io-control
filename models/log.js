const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	state: { type: Number, enum: [0, 1, 2] },
	device: Object,
	user: Object,
	meta: {
		createdAt: { type: Date, default: Date.now },
	},
});

module.exports = mongoose.model('Log', schema);
