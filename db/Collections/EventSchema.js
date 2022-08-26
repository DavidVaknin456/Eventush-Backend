const mongoose = require('mongoose');
const schema = mongoose.Schema;

let eventSchema = new schema({
    orgID: {
        type: String,
        required: true
    },
    category:  {
        type: String,
        required: true
    },
    date:  {
        type: String,
        required: true},
    location:  {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    minAge: {
        type: Number,
        required: true
    },
    members:  {
        type: [String],
    },
    isEventApproved: {
        type: Boolean,
        required: true
    }
}, {timestamps: true});

let Event = mongoose.model('Event', eventSchema);

module.exports = { Event };