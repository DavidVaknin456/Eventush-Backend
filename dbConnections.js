let mongoose = require('mongoose');

const dbClient = 'mongodb+srv://DavidVaknin:Dexter135@cluster0.jwsc6qw.mongodb.net/Test?retryWrites=true&w=majority'

let db = mongoose.connect(dbClient, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log("db is connected"))
    .catch((err) => console.log(err))

module.exports = db;