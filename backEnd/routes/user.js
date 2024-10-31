const express = require("express");
const { getFolders, createFolder,updateFolderName } = require("../controllers/user.js");

const router = express.Router();

router.get("/getFolders", getFolders);
router.post("/createFolder", createFolder); 
router.patch("/updateName", updateFolderName); 

module.exports = router;
