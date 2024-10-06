const { insertFolder, getRootFolder } = require("../models/folderModel.js");
const { updateUserAllocatedStorage } = require("../models/userModel.js");
const { mkdirFolder } = require("../utils/folderUtils.js");

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

const createUserFolder = async (req, res) => {
  try {
    const { user } = req.body;
    let { id, user_name, size } = user;

    const root = await getRootFolder();

    const creatingFolder = await mkdirFolder(root.location, user_name);
    if (!size || size === 0) {
      size = 15;
    }

    const result = await insertFolder(
      user_name,
      root.id,
      creatingFolder.folderPath,
      size,
      id,
    );
    const updateResult = await updateUserAllocatedStorage(id, size);

    if (!result || result.affectedRows === 0) {
      return res.status(409).json({ error: "User Folder already created" });
    }

    if (!updateResult || updateResult.affectedRows === 0) {
      return res
        .status(409)
        .json({ error: "Failed to update user's allocated storage" });
    }
    res.status(201).json({ message: "User Folder Created Successfully" });
  } catch (err) {
    res.status(500).json({ error: "Database Error " + err.message });
  }
};

module.exports = { createFolder, createUserFolder };
