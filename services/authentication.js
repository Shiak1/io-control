const {
    auth: { secret },
} = require('../config.json');

const jwt = require('jsonwebtoken');

const User = require('./user');

module.exports = async function({ username, password }) {
    const user = await User.findByUsername(username);

    await user.checkPassword(password);

    const { hash, ...rest } = user;

    return rest;
};