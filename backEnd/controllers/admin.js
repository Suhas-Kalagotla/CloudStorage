const { getAllUsers, updateUserEmailRole } = require("../models/userModel.js");

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
    const result = await updateUserEmailRole(role, allocatedStorage, id);
    if (result.affectedRows === 0) {
      return res.status(409).json({ error: "Failed to update User" });
    }
    res.status(200).json({ message: "Updated User successfully", id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getUsers, updateUser };
