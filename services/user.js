const mongoose = require('mongoose');
const Model = require('./model');
const Password = require('./password');
const schema = require('../models/user');
const tap = require('../utils/tap');

const { NotFound, Validation } = require('../exceptions');

class User extends Model {
    static async findByUsername(username) {
        const query = { username: new RegExp(`^${username}$`, 'i') };

        return tap(await this.findOne(query), user => {
            NotFound.throwUnless(user, 'User not found');
        });
    }

    static async create({ password, ...data }) {
        const user = new this(data);

        await user.setPassword(password);

        try {
            return await user.save();
        } catch (_) {
            throw new Validation('User already exists');
        }
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

    static list() {
        return this.find().select('-hash');
    }

    static async delete(id) {
        const user = await this.findOrFail(id);

        Validation.throwIf(user.role == 'Admin', 'Cannot delete admin user');

        await user.remove();
    }

    static async update({ id, password, ...update }) {
        const user = await this.findOrFail(id);

        if (password) {
            await user.setPassword(password);
        }

        for (const [key, value] of Object.entries(update)) {
            user[key] = value;
        }

        return await user.save();
    }

    async checkPassword(password) {
        try {
            await new Password(password).authenticate(this.hash);
        } catch (_) {
            throw new Validation('Password mismatch');
        }
    }

    async changePassword(value) {
        await this.setPassword(value);

        await this.save();
    }

    async setPassword(password) {
        this.hash = await new Password(password).hash();
    }

    get fullName() {
        return [this.name.first, this.name.last].filter(name => !!name).join(' ');
    }

    set fullName(value) {
        if (value) {
            const [first, last] = value.split(' ').filter(v => !!v);

            this.setName(first, last);
        } else {
            this.setName();
        }
    }

    setName(first = '', last = '') {
        this.name = { first, last };
    }

    data() {
        const { hash, ...rest } = super.data();

        return rest;
    }
}

schema.loadClass(User);

module.exports = mongoose.model('User', schema);
