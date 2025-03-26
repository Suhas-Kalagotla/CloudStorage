const express = require("express");
const upload = require("../utils/fileUpload.js");
const {
  getFolders,
  createFolder,
  updateFolderName,
  getFolderInfo,
  deleteFolder,
  uploadFile,
  getFilesByFolderId,
  getFiles,
  getFileInfo,
  deleteFile,
} = require("../controllers/user.js");
const { verifyOwner } = require("../middleware/verifyOwner.js");

const router = express.Router();

router.get("/getFolders", verifyOwner, getFolders);
router.get("/getFiles", verifyOwner, getFiles);
router.get("/getFolderInfo", verifyOwner, getFolderInfo);
router.get("/getAllFiles", verifyOwner, getFilesByFolderId);
router.get("/getFileInfo", verifyOwner, getFileInfo);
router.post("/createFolder", createFolder);
router.post("/fileUpload", upload, uploadFile);
router.patch("/updateName", verifyOwner, updateFolderName);
router.delete("/deleteFolder", verifyOwner, deleteFolder);
router.delete("/deleteFile", verifyOwner, deleteFile);

module.exports = router;
