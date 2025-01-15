const express = require("express");
const upload = require("../utils/fileUpload.js");
const {
  getFolders,
  createFolder,
  updateFolderName,
  getFolderInfo,
  deleteFolder,
  uploadFile,
} = require("../controllers/user.js");
const {
  verifyOwner,
  verifyUploadOwner,
} = require("../middleware/verifyOwner.js");

const router = express.Router();

router.get("/getFolders", verifyOwner, getFolders);
router.get("/getFolderInfo", verifyOwner, getFolderInfo);
router.post("/createFolder", createFolder);
router.post("/fileUpload", upload, uploadFile);
router.patch("/updateName", verifyOwner, updateFolderName);
router.delete("/deleteFolder", verifyOwner, deleteFolder);

module.exports = router;
