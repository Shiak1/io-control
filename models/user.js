const { Schema } = require('mongoose');

const schema = new Schema(
    {
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
        deviceGroups: [String],
        meta: {
            createdAt: { type: Date, default: Date.now },
        },
    },
    { toJSON: { virtuals: true } }
);

schema.virtual('groups', {
    ref: 'Device',
    localField: 'deviceGroups',
    foreignField: 'group',
    justOne: false,
});

module.exports = schema;
