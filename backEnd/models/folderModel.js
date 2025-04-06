const db = require("../db");
const { v4: uuidv4 } = require("uuid");

const getUniqueFolder = async (name, parentId) => {
  const query = `SELECT * FROM folder WHERE parent_folder_id=? AND name=?`;
  const [result] = await db.promise().query(query, [parentId, name]);
  return result.length === 1 ? result[0] : null;
};

const getFolderById = async (id) => {
  const query = `SELECT * FROM folder WHERE id=?`;
  const [result] = await db.promise().query(query, [id]);
  return result.length === 1 ? result[0] : null;
};

const getFoldersByParentId = async (id) => {
  const query = `SELECT id,name,parent_folder_id,size FROM folder WHERE parent_folder_id=?`;
  const [result] = await db.promise().query(query, [id]);
  return result;
};

const getAllFolders = async () => {
  const query = `SELECT * FROM folder`;
  const [result] = await db.promise().query(query);
  return result;
};

const insertFolder = async (name, parentFolderId, location, size, userId) => {
  const query = `INSERT IGNORE INTO folder (id,name,parent_folder_id,location,size,user_id) VALUES (?,?,?,?,?,?)`;
  const id = uuidv4();
  const [result] = await db.promise().query(query, [id, name, parentFolderId, location, size, userId]);
  return { result, id };
};

const deleteFolderDB = async (folder_id) => {
  const query = `DELETE FROM folder where id = ?`;
  const [result] = await db.promise().query(query, [folder_id]);
  return { result };
};

const getRootFolder = async () => {
  const query = `SELECT * FROM folder WHERE parent_folder_id IS NULL`;
  const [result] = await db.promise().query(query);
  return result[0];
};

const updateFolderSize = async (id, size) => {
  const query = `UPDATE folder SET size=? WHERE user_id=?`;
  const [result] = await db.promise().query(query, [size, id]);
  return result;
};

const updateFolderNameDB = async (id, name, location) => {
  const query = `UPDATE folder SET name=?, location=?  WHERE id=?`;
  const [result] = await db.promise().query(query, [name, location, id]);
  return result;
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

