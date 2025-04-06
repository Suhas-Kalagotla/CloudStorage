const db = require("../db");
const { v4: uuidv4 } = require("uuid");

const insertFile = async (name, location, size, folder_id) => {
  const query = `INSERT IGNORE INTO file (id,name,location,size,folder_id) VALUES (?,?,?,?,?)`;
  const id = uuidv4();
  const [result] = await db
    .promise()
    .query(query, [id, name, location, size, folder_id]);
  return { result, id };
};

const getAllFiles = async (folder_id) => {
  const query = `SELECT id,name,location,size,created_at FROM file WHERE folder_id = ?`;
  const [result] = await db.promise().query(query, [folder_id]);
  return result;
};

const countFiles = async (folder_id) => {
  const query = `SELECT COUNT(*) AS file_count FROM file WHERE folder_id = ?`;
  const [result] = await db.promise().query(query, [folder_id]);
  return result[0];
};

const getFileInfoDB = async (file_id) => {
  const query = `SELECT * FROM file WHERE id = ?`;
  const [result] = await db.promise().query(query, [file_id]);
  return result[0];
};

const deleteFileDB = async (file_id) => {
  const query = `DELETE FROM file WHERE id = ?`;
  const [result] = await db.promise().query(query, [file_id]);
  return result;
};

module.exports = {
  insertFile,
  getAllFiles,
  countFiles,
  getFileInfoDB,
  deleteFileDB,
};
