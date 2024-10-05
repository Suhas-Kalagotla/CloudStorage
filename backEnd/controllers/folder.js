const { insertFolder } = require("../models/folderModel.js")

const createFolder = async (req, res) => {
  try {
    const { userName } = req.body;
    const result = await insertFolder(userName);
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

module.exports = { createFolder };
