let admin = require("firebase-admin");

const serviceAccount = require("./rn-eventer-firebase-adminsdk-oghrh-9b926f2b19.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;