const express = require('express');
const {getAuth} = require("firebase-admin/auth");
const db = require('./dbConnections');
const Blog = require('./blog');
const admin = require("./firebaseAdminManager")
const PORT = process.env.PORT || 3000
const app = express()
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Heroku in your face")
    console.log("Basic get");
});


app.post('/post', async (req, res)  => {
    console.log("req post is active by user")
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
                const val = blog.save()
                    .then((result) => {
                        res.send(result)
                    })
                    .catch((err) => console.log(err))
                res.json(val);
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
    console.log("is reg is active by user")
    const receivedToken = req.header('authorization');
    if (receivedToken) {
        const idToken = receivedToken.split(" ")[1];
        // idToken comes from the client app
        console.log(idToken)
        getAuth().verifyIdToken(idToken)
            .then((decodedToken) => {
                Blog.findOne({uid: decodedToken.uid}).then((user) => {
                    res.json(user)
                }).catch((error) => {
                    console.log(error);
                    res.param(null);
                })
            })
            .catch((error) => {
                console.log(error);
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