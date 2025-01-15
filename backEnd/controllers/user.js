const fs = require("fs");
const path = require("path");
const {
  getFoldersByParentId,
  insertFolder,
  getFolderById,
  updateFolderNameDB,
  getUniqueFolder,
  getRootFolder,
  updateFolderSize,
} = require("../models/folderModel");
const { updateUserSize } = require("../models/userModel.js");
const cryptoJS = require("crypto-js");

const { mkdirFolder, renameFolder } = require("../utils/folderUtils.js");
const { insertFile } = require("../models/fileModel.js");

const getFolders = async (req, res) => {
  try {
    const user = req.user;
    const folder = req.folder;

    if (!folder) {
      return res.status(409).json({ error: "No Folder found" });
    }
    const allFolders = await getFoldersByParentId(folder.id);

    res.status(200).json({ folders: allFolders });
  } catch (err) {
    res.status(500).json({ error: "Database Error " + err.message });
  }
};

const getFolderInfo = async (req, res) => {
  try {
    const folder = req.folder;
    if (!folder) return res.status(409).json({ error: "No folder found" });

    folder.type = "Folder";
    delete folder.location;
    delete folder.parent_folder_id;
    delete folder.user_id;

    res.status(200).json({ folder: folder });
  } catch (err) {
    res.status(500).json({ error: "Database Error " + err.message });
  }
};

const createFolder = async (req, res) => {
  try {
    const user = req.user;
    const { newName, parentId } = req.body;
    let parentFolder;
    if (parentId === user.id) {
      const rootFolder = await getRootFolder();
      parentFolder = await getUniqueFolder(user.user_name, rootFolder.id);
    } else {
      parentFolder = await getFolderById(parentId);
    }

    const createFolder = await mkdirFolder(parentFolder.location, newName);

    const result = await insertFolder(
      newName,
      parentFolder.id,
      createFolder.folderPath,
      0,
      user.id,
    );

    if (!result || result.affectedRows === 0) {
      return res
        .status(409)
        .json({ error: "Folder with this name already exists" });
    }

    res
      .status(201)
      .json({ message: "Folder created successfully", folderId: result.id });
  } catch (err) {
    res.status(500).json({ error: "Database Error " + err.message });
  }
};

const updateFolderName = async (req, res) => {
  try {
    const { folderName } = req.query;
    const folder = req.folder;
    if (!folder) {
      return res.status(409).json({ error: "Folder doesn't exists" });
    }
    const updateFolder = await renameFolder(folder.location, folderName);
    if (!updateFolder) {
      res.status(409).json({ error: "Failed to rename folder" });
    }

    const updateFolderMetaData = await updateFolderNameDB(
      folder.id,
      folderName,
      updateFolder,
    );

    if (!updateFolderMetaData) {
      res.status(409).json({ error: "Failed to rename folder" });
    }
    res.status(200).json({ message: "Folder created successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Database Error " + err.message });
  }
};

const deleteFolder = async (req, res) => {
  try {
    res.status(404).json({ error: "feature is pending cannot delete folder" });
  } catch (err) {
    res.status(500).json({ error: "Database Error " + err.message });
  }
};

const uploadFile = async (req, res) => {
  try {
    const { fileName, folderId, chunk, isLastChunk } = req.fileData;
    let { fileSize } = req.fileData;
    if (!fileName || !chunk || isLastChunk === undefined) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    const secretKey = "difficulttofindkey1290";

    const bytes = cryptoJS.AES.decrypt(chunk, secretKey);
    const decryptedChunk = Buffer.from(
      cryptoJS.enc.Base64.stringify(bytes),
      "base64",
    );

    const user = req.user;
    let folder;
    if (folderId === user.id) {
      const parentFolder = await getRootFolder();
      folder = await getUniqueFolder(user.user_name, parentFolder.id);
    } else {
      folder = await getFolderById(folderId);
    }

    if (folder.user_id !== user.id) {
      return res.status(403).json({ error: "Forbidden to access" });
    }

    const uploadDir = folder.location;
    const filePath = path.join(uploadDir, fileName);

    fs.appendFileSync(filePath, decryptedChunk);

    fileSize = (fileSize / (1024 * 1024)).toFixed(2);
    if (isLastChunk === "true") {
      const result = await insertFile(fileName, filePath, fileSize, folder.id);
      const folderSize = parseFloat(folder.size) + parseFloat(fileSize);
      const userSize = parseFloat(user.used_storage) + parseFloat(fileSize);
      const result2 = await updateFolderSize(folder.id, folderSize);
      const result3 = await updateUserSize(user.id, userSize);
      if (!result || result.affectedRows == 0) {
        return res.status(409).json({ error: "file metadata not created" });
      }
      res.status(201).json({
        message: "File uploaded and decrypted successfully",
        userSize,
      });
    } else {
      res.status(200).json({ message: "Chunk uploaded successfully" });
    }
  } catch (error) {
    console.error("Error handling file upload:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getFolders,
  getFolderInfo,
  createFolder,
  deleteFolder,
  updateFolderName,
  uploadFile,
};
