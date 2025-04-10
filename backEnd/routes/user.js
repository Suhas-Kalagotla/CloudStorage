const express = require("express");
const upload = require("../utils/fileUpload.js");
const {
  getFolders,
  createFolder,
  updateFolderName,
  getFolderInfo,
  deleteFolder,
} = require("../controllers/user/folderOperations.jsx");

const {
  uploadFile,
  getFilesByFolderId,
  getFiles,
  getFileInfo,
  deleteFile,
  updateFileName,
} = require("../controllers/user/fileOperations.jsx");

const { verifyOwner } = require("../middleware/verifyOwner.js");

const router = express.Router();

router.get("/getFolders", verifyOwner, getFolders);
router.get("/getFiles", verifyOwner, getFiles);
router.get("/getFolderInfo", verifyOwner, getFolderInfo);
router.get("/getAllFiles", verifyOwner, getFilesByFolderId);
router.get("/getFileInfo", verifyOwner, getFileInfo);
router.post("/createFolder", createFolder);
router.post("/fileUpload", upload, uploadFile);
router.patch("/updateFolderName", verifyOwner, updateFolderName);
router.patch("/updateFileName", verifyOwner, updateFileName);
router.delete("/deleteFolder", verifyOwner, deleteFolder);
router.delete("/deleteFile", verifyOwner, deleteFile);

module.exports = router;
