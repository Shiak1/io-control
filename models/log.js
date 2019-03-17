const { Schema } = require('mongoose');

module.exports = new Schema({
    state: { type: Number, enum: [0, 1, 2] },
    device: Object,
    user: Object,
    meta: {
        createdAt: { type: Date, default: Date.now },
    },
});

module.exports = mongoose.model('User', schema);
