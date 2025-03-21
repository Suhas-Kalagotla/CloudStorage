const {
  getRootFolder,
  getUniqueFolder,
  getFolderById,
} = require("../models/folderModel");

const verifyOwner = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { folderId } = req.query;
    if (!folderId) {
      return res.status(400).json({ error: "folderId is required" });
    }

    let folder;
    if (folderId === user.id) {
      parentFolder = await getRootFolder();
      folder = await getUniqueFolder(user.user_name, parentFolder.id);
    } else {
      folder = await getFolderById(folderId);
    }

    if (folder.user_id !== user.id) {
      return res.status(403).json({ error: "Forbidden to access" });
    }

    req.folder = folder;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { verifyOwner };
