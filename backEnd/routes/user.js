const express = require("express");
const { getFolders, createFolder } = require("../controllers/user.js");

const router = express.Router();

router.get("/getFolders", getFolders);
router.post("/createFolder", createFolder); 

module.exports = router;
