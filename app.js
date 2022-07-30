const express = require('express');
const {getAuth} = require("firebase-admin/auth");
const db = require('./dbConnections');
const Blog = require('./blog');
const admin = require("./firebaseAdminManager")
const {json} = require("express");
const PORT = process.env.PORT || 3000
const app = express()
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Heroku in your face")
    console.log("Basic get");
});


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

// app.get('/all-blog', (req, res) => {
//     Blog.find()
//         .then((result) => {
//             res.send(result)
//         })
//         .catch((err) => console.log(err))
// })
//

// app.get('/all', (req, res) => {
//     Blog.find()
//         .then((result) => {
//             res.send(result)
//         })
//         .catch((err) => console.log(err))
// });

app.listen(PORT, () => console.log(`listening on ${PORT}`))