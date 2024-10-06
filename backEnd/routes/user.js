const express = require("express");
const { getFolders } = require("../controllers/user.js");

const router = express.Router();

router.get("/getFolders", getFolders);

module.exports = router;
