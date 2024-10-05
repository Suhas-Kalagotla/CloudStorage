const db = require("../db");
const { v4: uuidv4 } = require("uuid");

const getFolderByName = async (name) => {
  const query = `SELECT * FROM FOLDER WHERE name=?`;
  return new Promise((resolve, reject) => {
    db.query(query, [name], (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

const getAllFolders = async () => {
  const query = `SELECT * FROM FOLDER`;
  return new Promise((resolve, reject) => {
    db.query(query, [], (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

const insertFolder = async (name, parentFolderId, location, size, userId) => {
  const query = `INSERT IGNORE INTO table (id,name,parent_folder_id,location,size,user_id) VALUES (?,?,?,?,?,?)`;
  const id = uuidv4();
  return new Promise((resolve, reject) => {
    db.query(
      query,
      [id, name, parentFolderId, location, size, userId],
      (err, result) => {
        if (err) reject(err);
        resolve(result);
      },
    );
  });
};

module.exports = { getFolderByName, getAllFolders, insertFolder };
