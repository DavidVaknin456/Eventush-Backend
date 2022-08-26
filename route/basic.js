const express = require('express');
const router = express.Router();

// Basic Get
router.get('/', (req, res) => {
    res.send("Heroku in your face")
    console.log("Basic get");
});

module.exports = router;
