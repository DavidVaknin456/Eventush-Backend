const { getAuth } = require("firebase-admin/auth");
const { Event } = require("../db/Collections/EventSchema");
const express = require("express");
const router = express.Router();
const verifyToken = require("../util/verifyToken");

// Get Events
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
        const events = await Event.find({ members: { $ne: decodedToken.uid } });
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

// Add Event
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
  const receivedToken = req.header("authorization");
  const useridOrNO = await verifyToken(receivedToken);
  // add uid as a member
  console.log(useridOrNO);
  let doc = null;
  const addMember = async () => {
    const filter = { _id: req.body._id };
    const update = { $push: { members: [useridOrNO] } };
    console.log(filter);
    doc = await Event.findOneAndUpdate(filter, update);
  };

  if (useridOrNO !== 403 && useridOrNO !== 401) {
    console.log("add Member");
    await addMember();
    res.sendStatus(200);
  } else {
    res.sendStatus(useridOrNO);
  }
});

module.exports = router;
