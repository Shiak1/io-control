const createAdmin = require('./create-admin-if-not-exists');
const process = require('process');

const db = require('../services/db');

const noMongoFound =
	'mongodb is reqiuired to run this project,\
please configure and run npm install again.';

db()
	.then(async () => await createAdmin())
	.catch(() => console.error(noMongoFound))
	.then(() => process.exit());
