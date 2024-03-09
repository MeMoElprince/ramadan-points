const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    date: {
        type: Number,
        required: [true, 'Date is required']
    },
    name: {
        type: String,
        required: [true, 'name is required']
    },
    long: {
        type: Number,
        required: [true, 'Long is required']
    },
    points: {
        type: Number,
        default: 0
    }
});





const Schedule = mongoose.model('Schedule', scheduleSchema);
module.exports = Schedule;