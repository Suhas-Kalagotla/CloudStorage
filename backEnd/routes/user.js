const express = require("express");
const {
  getFolders,
  createFolder,
  updateFolderName,
  getFolderInfo,
} = require("../controllers/user.js");

const router = express.Router();

router.get("/getFolders", getFolders);
router.get("/getFolderInfo", getFolderInfo);
router.post("/createFolder", createFolder);
router.patch("/updateName", updateFolderName);

module.exports = router;
