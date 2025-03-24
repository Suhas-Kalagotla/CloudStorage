const db = require("../db");
const { v4: uuidv4 } = require("uuid");

const insertFile = (name, location, size, folder_id) => {
  const query = `INSERT IGNORE INTO file (id,name,location,size,folder_id) VALUES (?,?,?,?,?)`;
  const id = uuidv4();
  return new Promise((resolve, reject) => {
    db.query(query, [id, name, location, size, folder_id], (err, result) => {
      if (err) return reject(err);
      resolve({ result, id });
    });
  });
};

const getAllFiles = (folder_id) => {
  const query = `SELECT id,name,location,size,created_at FROM file WHERE folder_id = ?`;
  return new Promise((resolve, reject) => {
    db.query(query, [folder_id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const countFiles = (folder_id) => {
  const query = `SELECT  COUNT(*) AS file_count FROM file WHERE folder_id = ?`;
  return new Promise((resolve, reject) => {
    db.query(query, [folder_id], (err, result) => {
      if (err) return reject(err);
      resolve(result[0]);
    });
  });
};

const getFileInfoDB = (file_id) => {
  const query = `SELECT * FROM file WHERE id = ?`;
  return new Promise((resolve, reject) => {
    db.query(query, [file_id], (err, result) => {
      if (err) return reject(err);
      resolve(result[0]);
    });
  });
};

module.exports = {
  insertFile,
  getAllFiles,
  countFiles,
  getFileInfoDB,
};
