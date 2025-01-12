const {
  updateFolderSize,
  insertFolder,
  getRootFolder,
} = require("../models/folderModel.js");
const {
  getAllUsers,
  updateUserRole,
  deleteUserById,
  getUserById,
  updateUserAllocatedStorage,
} = require("../models/userModel.js");
const { mkdirFolder } = require("../utils/folderUtils.js");

const getUsers = async (req, res) => {
  try {
    const result = await getAllUsers();
    if (result.affectedRows === 0) {
      return res.status(409).json({ error: "No Users found" });
    }
    res.status(200).json({ message: "Users retrieved successfully", result });
  } catch (err) {
    res.status(500).json({ error: "Database Error " + err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { role, allocatedStorage, id } = req.body;
    if (role === null || allocatedStorage === null)
      return res.status(501).json({ error: "Invalid values" });

    const user = await getUserById(id);

    const folderResponse = await updateFolderSize(
      user.user_name,
      allocatedStorage,
    );

    if (folderResponse.affectedRows === 0) {
      return res.status(501).json({ error: "Failed to update size of folder" });
    }

    const result = await updateUserRole(role, allocatedStorage, id);
    if (result.affectedRows === 0) {
      return res.status(501).json({ error: "Failed to update User" });
    }
    res.status(200).json({ message: "Updated User successfully", id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.body;
    const result = await deleteUserById(id);
    if (result.affectedRows == 0) {
      return res.status(202).json({ error: "Failed to delete User" });
    }
    res.status(200).json({ message: "User deleted Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
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

module.exports = { getUsers, updateUser, deleteUser, createUserFolder };
