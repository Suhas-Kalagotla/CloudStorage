const db = require("../db");
const { v4: uuidv4 } = require("uuid");

const insertFile = (name, location, size, folder_id) => {
  const query = `INSERT IGNORE INTO file (id,name,location,size,folder_id) VALUES (?,?,?,?,?)`;
  const id = uuidv4();
  return new Promise((resolve, reject) => {
    db.query(query, [id, name, location, size, folder_id], (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve({ result, id });
    });
  });
};

const getAllFiles = (folder_id) => {
  const query = `SELECT * FROM FILES WHERE folder_id = ?`;
  return new Promise((resolve, reject) => {
    db.query(query, [folder_id], (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

module.exports = {
  insertFile,
  getAllFiles,
};
