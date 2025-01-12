const express = require("express");
const {
  getFolders,
  createFolder,
  updateFolderName,
  getFolderInfo,
  deleteFolder,
} = require("../controllers/user.js");

const router = express.Router();

router.get("/getFolders", getFolders);
router.get("/getFolderInfo", getFolderInfo);
router.post("/createFolder", createFolder);
router.patch("/updateName", updateFolderName);
router.delete("/updateName", deleteFolder);

module.exports = router;
