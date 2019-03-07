const createAdmin = require('./create-admin-if-not-exists');
const process = require('process');

const db = require('../services/db');

const noMongoFound =
    'mongodb is reqiuired to run this project,\
 please configure and run npm install again.';

async function init() {
    try {
        await db();
    } catch (_) {
        console.error(noMongoFound);

        process.exit(1);
    }

    await createAdmin();

    process.exit();
}

init();
