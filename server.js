const router = require('./router');
const mongoose = require('mongoose');
const process = require('process');
const express = require('express');
const db = require('./services/db');
const path = require('path');

const app = express();

async function boot() {
	await db();

	router(app, path.join(__dirname, 'frontend/dist'));

	app.listen(500);
}

boot()
	.then(() => console.log('Started'))
	.catch(error => {
		console.error(error);

		process.exit(1);
	});
