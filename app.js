const express = require('express');
const {getAuth} = require("firebase-admin/auth");
const db = require('./db/dbConnections');
const {Blog} = require('./db/blog');
const {Event} = require('./db/blog');
const admin = require("./util/firebaseAdminManager")
const {json} = require("express");
const PORT = process.env.PORT || 3000
const app = express()

app.use(express.json());

// Basic Get
app.get('/', (req, res) => {
    res.send("Heroku in your face")
    console.log("Basic get");
});

// Get User
app.get('/getUser', (req, res, next) => {
    console.log("getUser is active by user client")
    const receivedToken = req.header('authorization');
    if (receivedToken) {
        const idToken = receivedToken.split(" ")[1];
        // idToken comes from the client app
        console.log(idToken)
        getAuth().verifyIdToken(idToken)
            .then((decodedToken) => {
                Blog.findOne({uid: decodedToken.uid}, function (err, user) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log("success");
                        if (user === null) {
                            console.log("the user is unregistered", user);
                            res.send(false);
                        }
                        res.json(user);
                        console.log(user);
                    }
                })}).catch((error) => {
            console.log(error);
            console.log("invalid token");
            return res.sendStatus(403);
        });
    }
    else {
        res.sendStatus(401);
    }

});

// Add User
app.post('/post', async (req, res)  => {
    console.log("req post is active")
    const receivedToken = req.header('authorization');
    if (receivedToken) {
        const idToken = receivedToken.split(" ")[1];
        // idToken comes from the client app
        console.log(idToken)
        getAuth().verifyIdToken(idToken)
            .then((decodedToken) => {
                const blog = new Blog({
                    uid: decodedToken.uid,
                    name: req.body.name,
                    age: req.body.age,
                    city: req.body.city,
                })
                blog.save()
                    .then((val) => {
                        res.status(200).json(val);
                        console.log("user is added");
                        console.log(val);
                    })
                    .catch((err) => {
                        console.log(err);
                        console.log("error in added user")
                    })
            })
            .catch((error) => {
                console.log(error);
                res.sendStatus(403);
            });
        }
    else {
        res.sendStatus(401);
    }
})


// Get Events
app.get("/events", async (req, res) => {
    console.log("get events is active by client")
    const receivedToken = req.header('authorization');
    if (receivedToken) {
        const idToken = receivedToken.split(" ")[1];
        // idToken comes from the client app
        console.log(idToken)
        getAuth().verifyIdToken(idToken)
            .then(async (decodedToken) => {
                const events = await Event.find();
                console.log(events)
                return res.status(200).json(events);
            }).catch((error) => {
            console.log(error);
            console.log("invalid token");
            return res.sendStatus(403);
        });
    }
    else {
        res.sendStatus(401);
    }
});

// Add Event
app.post('/add-Event', async (req, res)  => {
    console.log("addEvent post is active")
    const receivedToken = req.header('authorization');
    if (receivedToken) {
        const idTokenGetFromClient = receivedToken.split(" ")[1];
        // idToken comes from the client app
        console.log(idTokenGetFromClient)
        getAuth().verifyIdToken(idTokenGetFromClient)
            .then((decodedToken) => {
                console.log(decodedToken.uid)
                const event = new Event({
                    orgID: decodedToken.uid,
                    category: req.body.category,
                    date: req.body.date,
                    location: req.body.location,
                    minAge: req.body.minAge,
                    description: req.body.description
                })
                event.save().then((val) => {
                    res.status(200).json(val);
                    console.log("user is added");
                    console.log(val);
                })
                    .catch((err) => {
                        console.log(err);
                        console.log("error in added user")
                    })
            })
            .catch((error) => {
                console.log(error);
                res.sendStatus(403);
            });
    }
    else {
        res.sendStatus(401);
    }
})

app.listen(PORT, () => console.log(`listening on ${PORT}`))