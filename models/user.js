const { Schema } = require('mongoose');

module.exports = new Schema({
	username: { type: String, unique: true, required: true },
	hash: { type: String, required: true },
	name: {
		first: { type: String },
		last: { type: String },
	},
	meta: {
		createdAt: { type: Date, default: Date.now },
	},
	role: {
		type: String,
		enum: ['Admin', 'Manager', 'User'],
		required: true,
		default: 'User',
	},
});
