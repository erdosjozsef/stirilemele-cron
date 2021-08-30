const express = require("express");
const maszolController = require("../api/maszol");

const router = express.Router();

// https://www.b1.ro
router.get("/", maszolController.postScraping);

module.exports = router;
