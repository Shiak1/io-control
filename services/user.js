const mongoose = require('mongoose');
const Password = require('./password');
const schema = require('../models/user');
const tap = require('../utils/tap');

const { NotFound, Validation } = require('../exceptions');

class User {
    static async findByUsername(username) {
        const query = { username: new RegExp(`^${username}$`, 'i') };

        return tap(await this.findOne(query), user => {
            NotFound.throwUnless(user, 'User not found');
        });
    }

    static async findById(id) {
        return tap(await this.findById(id), user => {
            NotFound.throwUnless(user, 'User not found');
        });
    }

    static async create({ password, ...data }) {
        const user = new this(data);

        await user.setPassword(password);

        return await user.save();
    }

    static async createIfNotExists(user) {
        try {
            await this.findByUsername(user.username);

            return false;
        } catch (error) {
            if (!(error instanceof NotFound)) throw error;

            return await this.create(user);
        }
    }

    async checkPassword(password) {
        try {
            await new Password(password).authenticate(this.hash);
        } catch {
            throw new Validation('Password mismatch');
        }
    }

    async changePassword(current, value) {
        await this.checkPassword(current);

        await this.setPassword(value);

        await this.save();
    }

    async setPassword(password) {
        this.hash = await new Password(password).hash();
    }
}

schema.loadClass(User);

module.exports = mongoose.model('User', schema);
