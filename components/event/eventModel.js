const mongoose = require('mongoose');
const moment = require('moment');


const EventSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
        trim: true,
    },
    trigger: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    action: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    severity: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    client: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    details: {
        required: true,
        type: Array,
    },
    meta: {
        required: true,
        type: Array,
    },
});


EventSchema.pre('save', function cb(next) {

    if (this.isModified('date')) {
        this.date = moment(this.date).toISOString();
    }

    next();
});


module.exports = mongoose.model('Event', EventSchema);
