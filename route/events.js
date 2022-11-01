const {getAuth} = require("firebase-admin/auth");
const {Event} = require("../db/Collections/EventSchema");
const express = require("express");
const router = express.Router();
const verifyToken = require("../util/verifyToken");

// All Events
router.get("/events", async (req, res) => {
    console.log("get events is active by client");
    const receivedToken = req.header("authorization");
    if (receivedToken) {
        const idToken = receivedToken.split(" ")[1];
        // idToken comes from the client app
        console.log(idToken);
        getAuth()
            .verifyIdToken(idToken)
            .then(async (decodedToken) => {
                const events = await Event.find({members: {$ne: decodedToken.uid}});
                console.log(events);
                return res.status(200).json(events);
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

router.post("/add-Event", async (req, res) => {
    console.log("addEvent post is active");
    const receivedToken = req.header("authorization");
    if (receivedToken) {
        const idTokenGetFromClient = receivedToken.split(" ")[1];
        // idToken comes from the client app
        console.log(idTokenGetFromClient);
        getAuth()
            .verifyIdToken(idTokenGetFromClient)
            .then((decodedToken) => {
                console.log(decodedToken.uid);
                const event = new Event({
                    orgID: decodedToken.uid,
                    category: req.body.category,
                    date: req.body.date,
                    location: req.body.location,
                    minAge: req.body.minAge,
                    minMembers: req.body.minMembers,
                    maxMembers: req.body.maxMembers,
                    description: req.body.description,
                    isEventApproved: req.body.isEventApproved,
                });
                event
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

router.put("/addMember", async (req, res) => {
    console.log("put member events ");
    const useridOrNO = await verifyToken(req.header("authorization"));
    const eventDoc = req.body;

    let doc = null;
    const addMember = async (isApproved) => {
        const filter = {_id: req.body._id};
        const update = {
            $push: {members: [useridOrNO]},
        };
        console.log(filter);
        doc = await Event.updateOne(filter, update);
        doc = await Event.updateOne(filter, {
            $set: {isEventApproved: isApproved},
        });
    };

    if (useridOrNO !== 403 && useridOrNO !== 401) {
        if (eventDoc.members.length + 1 < eventDoc.maxMembers) {
            await addMember(false);
        } else {
            await addMember(true);
        }
        res.sendStatus(200);
    } else {
        res.sendStatus(useridOrNO);
    }
});

// My Events
router.get("/myEvents", async (req, res) => {
    console.log("get myEvents");
    const useridOrNO = await verifyToken(req.header("authorization"));

    let doc = null;
    const returnMyEvents = async () => {
        doc = await Event.find({
            members: {$in: [useridOrNO]},
            isEventApproved: {$in: false},
        });
    };

    if (useridOrNO !== 403 && useridOrNO !== 401) {
        await returnMyEvents();
        res.status(200).json(doc);
    } else {
        res.sendStatus(useridOrNO);
    }
});

router.get("/approvedEvents", async (req, res) => {
    console.log("get ApprovedEvents");
    const useridOrNO = await verifyToken(req.header("authorization"));

    console.log(useridOrNO);
    let doc = null;
    const returnMyEvents = async () => {
        doc = await Event.find({
            members: {$in: [useridOrNO]},
            isEventApproved: {$in: true},
        });
    };

    if (useridOrNO !== 403 && useridOrNO !== 401) {
        await returnMyEvents();
        res.status(200).json(doc);
    } else {
        res.sendStatus(useridOrNO);
    }
});

router.put("/RemoveEvent", async (req, res) => {
    console.log("Remove event from my personal events");
    const useridOrNO = await verifyToken(req.header("authorization"));
    const eventDoc = req.body;

    let doc = null;
    const approvedEvent = async (isApproved) => {
        const filter = {_id: req.body._id};
        const update = {
            $pull: {members: [useridOrNO]},
        };
        console.log(filter);
        doc = await Event.updateOne(filter, update);
        doc = await Event.updateOne(filter, {
            $set: {isEventApproved: false},
        });
    };

    if (useridOrNO !== 403 && useridOrNO !== 401) {
        await approvedEvent();
        res.sendStatus(200);

    } else {
        res.sendStatus(useridOrNO);
    }
});
// admin Events
router.get("/adminEvents", async (req, res) => {
    console.log("get adminEvents");
    const useridOrNO = await verifyToken(req.header("authorization"));

    let doc = null;
    const returnAdminEvents = async () => {
        doc = await Event.find({orgID: {$in: [useridOrNO]}});
    };

    if (useridOrNO !== 403 && useridOrNO !== 401) {
        await returnAdminEvents();
        res.status(200).json(doc);
    } else {
        res.sendStatus(useridOrNO);
    }
});

router.put("/closeRegistration", async (req, res) => {
    console.log("closeRegistration admin");
    const useridOrNO = await verifyToken(req.header("authorization"));
    const eventDoc = req.body;

    let doc = null;
    const approvedEvent = async (isApproved) => {
        const filter = {_id: req.body._id};
        console.log(filter);
        doc = await Event.updateOne(filter, {
            $set: {isEventApproved: isApproved},
        });
    };

    if (useridOrNO !== 403 && useridOrNO !== 401) {
        if (
            eventDoc.members.length >= eventDoc.minMembers &&
            eventDoc.members.length < eventDoc.maxMembers
        ) {
            await approvedEvent(true);
        } else {
            await approvedEvent(false);
        }
        res.sendStatus(200);
    } else {
        res.sendStatus(useridOrNO);
    }
});

router.delete("/deleteEvent", async (req, res) => {
    console.log("deleteEvent admin");
    const useridOrNO = await verifyToken(req.header("authorization"));
    console.log(req.body);
    let doc = null;
    const deleteEvent = async () => {
        const filter = {_id: req.body.id};
        console.log(filter);
        doc = await Event.deleteOne(filter);
    };

    if (useridOrNO !== 403 && useridOrNO !== 401) {
        await deleteEvent();
        res.sendStatus(200);
    } else {
        res.sendStatus(useridOrNO);
    }
});

module.exports = router;
