const { getAllUsers } = require("../models/userModel.js");

const getUsers = async (req, res) => {
  try {
    getAllUsers((err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database Error" });
      }
      if (result.affectedRows === 0) {
        return res.status(409).json({ error: "No Users found" });
      }
      res.status(200).json({ message: "Users retrieved successfully", result });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getUsers };
