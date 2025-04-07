const {
  getFoldersByParentId,
  insertFolder,
  deleteFolderDB,
  getFolderById,
  updateFolderNameDB,
  getUniqueFolder,
  getRootFolder,
} = require("../../models/folderModel.js");

const {
  mkdirFolder,
  renameFolder,
  rmFolder,
} = require("../../utils/folderUtils.js");

const { countFiles } = require("../../models/fileModel.js");

const getFolders = async (req, res) => {
  try {
    const folder = req.folder;

    if (!folder) {
      return res.status(409).json({ error: "No Folder found" });
    }
    const allFolders = await getFoldersByParentId(folder.id);

    res.status(200).json({ folders: allFolders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server Error" });
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

    return res.status(200).json({ folder: folder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server Error" });
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
    console.error(err);
    res.status(500).json({ error: "Internal server Error" });
  }
};

const updateFolderName = async (req, res) => {
  try {
    const { folderName } = req.query;
    const folder = req.folder;
    if (!folder) {
      return res.status(409).json({ error: "Folder doesn't exists" });
    }
    const updateFolderLocation = await renameFolder(folder.location, folderName);
    if (!updateFolderLocation) {
      return res.status(409).json({ error: "Failed to rename folder" });
    }

    const updateFolderMetaData = await updateFolderNameDB(
      folder.id,
      folderName,
      updateFolderLocation,
    );

    if (!updateFolderMetaData) {
      return res.status(409).json({ error: "Failed to rename folder" });
    }
    res.status(200).json({ message: "Folder name updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server Error " });
  }
};

const deleteFolder = async (req, res) => {
  try {
    const folder = req.folder;
    const count = await countFiles(folder.id);
    if (count.file_count > 0) {
      return res.status(400).json({ error: "Folder is not empty" });
    }
    await deleteFolderDB(folder.id);
    await rmFolder(folder.location);

    res.status(200).json({ message: `${folder.name} deleted successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server Error" });
  }
};

module.exports = {
  getFolders,
  getFolderInfo,
  createFolder,
  deleteFolder,
  updateFolderName,
};
