const db = require("../db.js");
const { v4: uuidv4 } = require("uuid");

const insertUser = async (userName, email, password, role) => {
  const query = `INSERT IGNORE INTO users (id,user_name, email , password,role) VALUES (?, ?, ?, ?, ?)`;
  const id = uuidv4();
  const [result] = await db
    .promise()
    .query(query, [id, userName, email, password, role]);
  return result;
};

const getUserByEmail = async (email) => {
  const query = `SELECT * FROM users WHERE email = ? `;
  const [result] = await db.promise().query(query, [email]);
  return result.length === 1 ? result[0] : null;
};

const getUserById = async (id) => {
  const query = `SELECT id,user_name,email,role,used_storage,allocated_storage,created_at FROM users WHERE id= ? `;
  const [result] = await db.promise().query(query, [id]);
  return result.length === 1 ? result[0] : null;
};

const getAllUsers = async () => {
  const query = `SELECT id,user_name,email,role,used_storage,allocated_storage,created_at FROM users`;
  const [result] = await db.promise().query(query);
  return result;
};

const updateUserRole = async (role, allocatedStorage, id) => {
  const query = `UPDATE users SET role=?, allocated_storage=? WHERE id=?`;
  const [result] = await db
    .promise()
    .query(query, [role, allocatedStorage, id]);
  return result;
};

const deleteUserById = async (id) => {
  const query = `DELETE FROM users WHERE id=?`;
  const [result] = await db.promise().query(query, [id]);
  return result;
};

const updateUserAllocatedStorage = async (id, size) => {
  const query = `UPDATE users SET allocated_storage=? WHERE id=?`;
  const [result] = await db.promise().query(query, [size, id]);
  return result;
};

const updateUserSize = async (id, size) => {
  const updateQuery = `UPDATE users SET used_storage = used_storage + ? WHERE id = ?`;
  await db.promise().query(updateQuery, [size, id]);

  const selectQuery = `SELECT used_storage FROM users WHERE id = ?`;
  const [[user]] = await db.promise().query(selectQuery, [id]);

  return user.used_storage;
};

module.exports = {
  insertUser,
  getUserByEmail,
  getUserById,
  getAllUsers,
  updateUserRole,
  deleteUserById,
  updateUserAllocatedStorage,
  updateUserSize,
};
