const mongoose = require('mongoose');

const {
	db: { URI },
} = require('../config.json');

module.exports = async function() {
	await mongoose.connect(URI, {
		useCreateIndex: true,
		useNewUrlParser: true,
	});

	mongoose.Promise = global.Promise;
};
