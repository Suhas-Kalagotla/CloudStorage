const db = require("../db");
const { v4: uuidv4 } = require("uuid");

const getUniqueFolder = (name, parentId) => {
  const query = `SELECT * FROM folder WHERE parent_folder_id=? AND name=?`;
  return new Promise((resolve, reject) => {
    db.query(query, [parentId, name], (err, result) => {
      if (err) return reject(err);
      resolve(result.length === 1 ? result[0] : null);
    });
  });
};

const getFolderById = (id) => {
  const query = `SELECT * FROM folder WHERE id=?`;
  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, result) => {
      if (err) return reject(err);
      resolve(result.length === 1 ? result[0] : null);
    });
  });
};

const getFoldersByParentId = (id) => {
  const query = `SELECT id,name,parent_folder_id,size FROM folder WHERE parent_folder_id=?`;
  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const getAllFolders = () => {
  const query = `SELECT * FROM folder`;
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
        resolve({ result, id });
      },
    );
  });
};

const deleteFolderDB = (folder_id) => {
  const query = `DELETE FROM folder where id = ?`;
  return new Promise((resolve, reject) => {
    db.query(query, [folder_id], (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve({ result });
    });
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

const updateFolderSize = (id, size) => {
  const query = `UPDATE folder SET size=? WHERE user_id=?`;
  return new Promise((resolve, reject) => {
    db.query(query, [size, id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const updateFolderNameDB = (id, name, location) => {
  const query = `UPDATE folder SET name=?, location=?  WHERE id=?`;
  return new Promise((resolve, reject) => {
    db.query(query, [name, location, id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

module.exports = {
  getAllFolders,
  getRootFolder,
  getFoldersByParentId,
  getFolderById,
  getUniqueFolder,
  insertFolder,
  updateFolderSize,
  updateFolderNameDB,
  deleteFolderDB,
};
