const db = require("../db");
const { v4: uuidv4 } = require("uuid");

const getFolderByName = (name) => {
  const query = `SELECT * FROM FOLDER WHERE name=?`;
  return new Promise((resolve, reject) => {
    db.query(query, [name], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const getAllFolders = () => {
  const query = `SELECT * FROM FOLDER`;
  return new Promise((resolve, reject) => {
    db.query(query, [], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const insertFolder = (name, parentFolderId, location, size, userId) => {
  const query = `INSERT IGNORE INTO folder (id,name,parent_folder_id,location,size,user_id) VALUES (?,?,?,?,?,?)`;
  const id = uuidv4();
  return new Promise((resolve, reject) => {
    db.query(
      query,
      [id, name, parentFolderId, location, size, userId],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      },
    );
  });
};

const getRootFolder = () => {
  const query = `SELECT * FROM folder WHERE parent_folder_id IS NULL`;
  return new Promise((resolve, reject) => {
    db.query(query, [], (err, result) => {
      if (err) return reject(err);
      resolve(result[0]);
    });
  });
};

const updateFolderSize = (name, size) => {
  const query = `UPDATE folder SET size=? WHERE name=?`;
  return new Promise((resolve, reject) => {
    db.query(query, [size, name], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

module.exports = {
  getFolderByName,
  getAllFolders,
  insertFolder,
  getRootFolder,
  updateFolderSize,
};
