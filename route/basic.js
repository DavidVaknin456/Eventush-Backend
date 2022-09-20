const express = require("express");
const router = express.Router();

// Basic Get
router.get("/", (req, res) => {
  res.send("Heroku in your face");
  console.log("Basic get");
});

router.get("/video/progressive/cfid-111_stid-222_end.mp4", (req, res) => {
  res.sendStatus(500);
  console.log("res.sendStatus(500)");
});

module.exports = router;
