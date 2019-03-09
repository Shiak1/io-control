const tap = require('../utils/tap');
const { NotFound } = require('../exceptions');

module.exports = class {
	static async findOrFail(id) {
		const model = await this.findById(id);

		return tap(model, model => NotFound.throwUnless(model));
	}

	data() {
		return this.toObject({ getters: true });
	}
};
