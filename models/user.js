const { Schema } = require('mongoose');

module.exports = new Schema({
    username: { type: String, unique: true, required: true, index: true },
    hash: { type: String, required: true },
    name: { first: String, last: String },
    role: {
        type: String,
        enum: ['Admin', 'Manager', 'User'],
        required: true,
        default: 'User',
    },
    devices: [{ type: Schema.Types.ObjectId, ref: 'Device' }],
    groups: [String],
    meta: {
        createdAt: { type: Date, default: Date.now },
    },
});
