const {
  getFolderByName,
  getFoldersByParentId,
  insertFolder,
} = require("../models/folderModel");
const { mkdirFolder } = require("../utils/folderUtils.js");

const getFolders = async (req, res) => {
  try {
    const user = req.user;
    const folder = await getFolderByName(user.user_name);
    if (!folder) return res.status(409).json({ error: "No Folder found" });

    const allFolders = await getFoldersByParentId(folder.id);

    res.status(200).json({ folders: allFolders });
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
      parentFolder = await getFolderByName(user.user_name);
    } else {
      parentFolder = await getFoldersByParentId(parentId);
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

    res.status(201).json({ message: "Folder created successfully" });
  } catch (err) {
    res.status(500).json({ error: "Database Error " + err.message });
  }
};

module.exports = { getFolders, createFolder };
