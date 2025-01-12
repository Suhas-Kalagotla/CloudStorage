const {
  getFoldersByParentId,
  insertFolder,
  getFolderById,
  updateFolderNameDB,
  getUniqueFolder,
  getRootFolder,
} = require("../models/folderModel");

const { mkdirFolder, renameFolder } = require("../utils/folderUtils.js");

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
    const { folderName } = req.body;
    const folder = req.folder;
    if (!folder) {
      return res.status(409).json({ error: "Folder doesn't exists" });
    }
    const updateFolder = await renameFolder(folder.location, folderName);
    if (!updateFolder) {
      res.status(409).json({ error: "Failed to rename folder" });
    }

    const updateFolderMetaData = await updateFolderNameDB(
      id,
      folderName,
      updateFolder,
    );

    if (!updateFolderMetaData) {
      res.status(409).json({ error: "Failed to rename folder" });
    }
    res.status(200).json({ message: "Folder created successfully" });
  } catch (err) {
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

module.exports = {
  getFolders,
  getFolderInfo,
  createFolder,
  deleteFolder,
  updateFolderName,
};
