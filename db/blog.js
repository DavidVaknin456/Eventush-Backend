const mongoose = require('mongoose');
const schema = mongoose.Schema;

let blogSchema = new schema({
    uid:  {
        type: String,
        required: true
    },
    name:  {
        type: String,
        required: true
    },
    age:  {
        type: String,
        required: true},
    city:  {
        type: String,
        required: true
    },
}, {timestamps: true});

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
}, {timestamps: true});

let Blog = mongoose.model('Blog', blogSchema);
let Event = mongoose.model('Event', eventSchema);

module.exports = {Blog, Event};