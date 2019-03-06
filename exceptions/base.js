module.exports = class Base extends Error {
    constructor(code = 500, message = 'Unknown error') {
        super(message);

        this.code = code;
    }

    static throwIf(condition, ...params) {
        if (condition) {
            throw new this(...params);
        }
    }

    static throwUnless(condition, ...params) {
        if (condition) return;

        throw new this(...params);
    }

    static handle(error, callback) {
        if (error instanceof this) {
            callback();
        }
    }
};
