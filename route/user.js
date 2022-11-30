const express = require("express");
const {getAuth} = require("firebase-admin/auth");
const {Blog} = require("../db/Collections/BlogSchema");
const verifyToken = require("../util/verifyToken");
const {Event} = require("../db/Collections/EventSchema");
const router = express.Router();

// Get User
router.get("/getUser", (req, res, next) => {
    console.log("getUser is active by user client");
    const receivedToken = req.header("authorization");
    if (receivedToken) {
        const idToken = receivedToken.split(" ")[1];
        // idToken comes from the client app
        console.log(idToken);
        getAuth()
            .verifyIdToken(idToken)
            .then((decodedToken) => {
                Blog.findOne({uid: decodedToken.uid}, (err, user) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("success");
                        if (user === null) {
                            console.log("the user is unregistered", user);
                            res.send(false);
                            console.log("-----");
                        } else {
                            res.json(user);
                            console.log(user);
                        }
                    }
                });
            })
            .catch((error) => {
                console.log(error);
                console.log("invalid token");
                return res.sendStatus(403);
            });
    } else {
        res.sendStatus(401);
    }
});

// Add User
router.post("/post", async (req, res) => {
    console.log("req post is active");
    const receivedToken = req.header("authorization");
    if (receivedToken) {
        const idToken = receivedToken.split(" ")[1];
        // idToken comes from the client app
        console.log(idToken);
        getAuth()
            .verifyIdToken(idToken)
            .then((decodedToken) => {
                const blog = new Blog({
                    uid: decodedToken.uid,
                    name: req.body.name,
                    age: req.body.age,
                    city: req.body.city,
                });
                blog
                    .save()
                    .then((val) => {
                        res.status(200).json(val);
                        console.log("user is added");
                        console.log(val);
                    })
                    .catch((err) => {
                        console.log(err);
                        console.log("error in added user");
                    });
            })
            .catch((error) => {
                console.log(error);
                res.sendStatus(403);
            });
    } else {
        res.sendStatus(401);
    }
});

router.put("/updateLocation", async (req, res) => {
    console.log("updateLocation");
    const useridOrNO = await verifyToken(req.header("authorization"));
    const loc = req.body;

    // update location
    const updateLocation = async () => {
        const filter = {uid: useridOrNO};
        console.log(filter)
        await Event.updateOne(filter, {
            $set: {location: loc},
        });
    }


    if (useridOrNO !== 403 && useridOrNO !== 401) {
        await updateLocation();
        res.sendStatus(200);

    } else {
        res.sendStatus(useridOrNO);
    }
});

module.exports = router;
