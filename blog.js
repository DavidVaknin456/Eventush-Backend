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

let Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;