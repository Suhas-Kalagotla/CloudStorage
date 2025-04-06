const fs = require("fs");
const path = require("path");
const db = require("../../db.js");

const {
  getFolderById,
  getUniqueFolder,
  getRootFolder,
  updateFolderSize,
} = require("../../models/folderModel");
const { updateUserSize, getUserById } = require("../../models/userModel.js");
const {
  insertFile,
  getAllFiles,
  getFileInfoDB,
  deleteFileDB,
} = require("../../models/fileModel.js");

const { rmFile } = require("../../utils/fileUtils.js");
const cryptoJs = require("crypto-js");

const uploadFile = async (req, res) => {
  const connection = await db.promise().getConnection();
  try {
    const { fileName, folderId, chunk, isLastChunk } = req.fileData;
    let { fileSize } = req.fileData;
    if (!fileName || !chunk || isLastChunk === undefined) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    const secretKey = process.env.SECRET_KEY;

    const bytes = cryptoJs.AES.decrypt(chunk, secretKey);
    const decryptedChunk = Buffer.from(
      cryptoJs.enc.Base64.stringify(bytes),
      "base64",
    );

    const user = req.user;
    const userDatabase = await getUserById(user.id);
    let folder;
    if (folderId === user.id) {
      const parentFolder = await getRootFolder();
      folder = await getUniqueFolder(user.user_name, parentFolder.id);
    } else {
      folder = await getFolderById(folderId);
    }

    if (folder.user_id !== user.id) {
      return res.status(403).json({ error: "Forbidden to access" });
    }

    const uploadDir = folder.location;
    const filePath = path.join(uploadDir, fileName);

    fs.appendFileSync(filePath, decryptedChunk);

    fileSize = (fileSize / (1024 * 1024)).toFixed(2);
    let folderSize, userSize;
    if (isLastChunk === "true") {
      await connection.beginTransaction();

      const result = await insertFile(fileName, filePath, fileSize, folder.id);
      folderSize = parseFloat(folder.size) + parseFloat(fileSize);
      userSize = parseFloat(userDatabase.used_storage) + parseFloat(fileSize);

      await updateFolderSize(folder.id, folderSize);
      await updateUserSize(user.id, userSize);

      if (!result || result.affectedRows == 0) {
        await connection.rollback();
        return res.status(409).json({ error: "file metadata not created" });
      }

      await connection.commit();

      res.status(201).json({
        message: "File uploaded and decrypted successfully",
        folderSize: folderSize,
        userSize: userSize,
      });
    } else {
      res.status(200).json({
        message: "Chunk uploaded successfully",
      });
    }
  } catch (err) {
    if (connection) await connection.rollback();
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    if (connection) connection.release();
  }
};

const getFilesByFolderId = async (req, res) => {
  try {
    const folder = req.folder;
    if (!folder) {
      return res.status(409).json({ error: "No Folder found" });
    }
    const allFiles = await getAllFiles(folder.id);
    res.status(200).json({ folders: allFiles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getFiles = async (req, res) => {
  try {
    const chunkSize = 64 * 1024;
    const secretKey = process.env.SECRET_KEY;
    const folder = req.folder;
    const files = await getAllFiles(folder.id);
    const result = [];

    for (const file of files) {
      const fileBuffer = fs.readFileSync(file.location);
      const name = file.name;
      const id = file.id;
      let chunks = [];
      let offset = 0;
      while (offset < fileBuffer.length) {
        const chunk = fileBuffer.slice(offset, offset + chunkSize);
        const encryptedChunk = cryptoJs.AES.encrypt(
          cryptoJs.lib.WordArray.create(chunk),
          secretKey,
        ).toString();
        offset += chunkSize;
        const isLastChunk = offset >= fileBuffer.length;
        chunks.push({ encryptedChunk, isLastChunk });
      }
      result.push({ name, id, chunks });
    }

    res.status(200).json({ files: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server Error" });
  }
};

const getFileInfo = async (req, res) => {
  try {
    const { fileId } = req.query;
    const file = await getFileInfoDB(fileId);
    if (!file) return res.status(409).json({ error: "No file found" });

    file.type = "File";
    delete file.location;
    delete file.folder_id;

    return res.status(200).json({ file: file });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server Error" });
  }
};

const deleteFile = async (req, res) => {
  const connection = await db.promise().getConnection();
  try {
    const { fileId, folderId } = req.query;
    const user = req.user;
    const [file, folder, userDatabase] = await Promise.all([
      getFileInfoDB(fileId),
      getFolderById(folderId),
      getUserById(user.id),
    ]);

    if (!file) return res.status(409).json({ error: "No file found" });

    let fileSize = parseFloat(file.size);
    console.log(folder);
    let folderSize = parseFloat(folder.size) - fileSize;
    let userSize = parseFloat(userDatabase.used_storage) - fileSize;

    await connection.beginTransaction();

    await updateFolderSize(folder.id, folderSize);
    await updateUserSize(user.id, userSize);
    await deleteFileDB(file.id);

    await connection.commit();

    await rmFile(file.location);

    res.status(200).json({ message: `${file.name} deleted successfully` });
  } catch (err) {
    if (connection) await connection.rollback();
    console.error(err);
    res.status(500).json({ error: "Internal server Error" });
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  uploadFile,
  getFilesByFolderId,
  getFiles,
  getFileInfo,
  deleteFile,
};
