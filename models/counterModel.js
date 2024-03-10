const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    name: {type: String, required: true, unique: true},
    sequence_value: { type: Number, default: 0 }
});


const Counter = mongoose.model('Counter', counterSchema);
module.exports = Counter;