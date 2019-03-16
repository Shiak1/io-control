const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const {
	db: { URI },
} = require('../config.json');

module.exports = async function() {
	await mongoose.connect(URI, {
		useMongoClient: true,
	});

	mongoose.Promise = global.Promise;
};
