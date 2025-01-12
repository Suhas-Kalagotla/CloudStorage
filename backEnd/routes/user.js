const express = require("express");
const {
  getFolders,
  createFolder,
  updateFolderName,
  getFolderInfo,
  deleteFolder,
} = require("../controllers/user.js");
const verifyOwner = require("../middleware/verifyOwner.js");

const router = express.Router();

router.get("/getFolders",verifyOwner, getFolders);
router.get("/getFolderInfo",verifyOwner, getFolderInfo);
router.post("/createFolder", createFolder);
router.patch("/updateName", verifyOwner,updateFolderName);
router.delete("/updateName", verifyOwner,deleteFolder);

module.exports = router;
