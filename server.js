const db = require('./services/db');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const process = require('process');
const router = require('./router');

require('./utils/array');

const {
	app: { port },
} = require('./config');

const app = express();

async function boot() {
	await db();

	router(app, path.join(__dirname, 'frontend/dist'));

	app.listen(port, '127.0.0.1');
}

boot()
	.then(() => console.log('Started'))
	.catch(error => {
		console.error(error);

		process.exit(1);
	});
