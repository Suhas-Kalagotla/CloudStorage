const {
  getFolderByName,
  getFoldersByParentId,
} = require("../models/folderModel");

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
    const { user } = req.body;
    let { id, user_name, parent_folder_id, location, size } = user;
    const result = await insertFolder(
      user_name,
      parent_folder_id,
      location,
      size,
      id,
    );

    if (result.affectedRows === 0) {
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
