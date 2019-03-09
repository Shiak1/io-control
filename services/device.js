const mongoose = require('mongoose');
const Model = require('./model');
const schema = require('../models/device');
const tap = require('../utils/tap');

class Device extends Model {}

schema.loadClass(Device);

module.exports = mongoose.model('Device', schema);
