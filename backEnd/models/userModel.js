const db = require("../db.js");
const { v4: uuidv4 } = require("uuid");

const insertUser = async (userName, email, password, role) => {
  const query = `INSERT IGNORE INTO users (id,user_name, email , password,role) VALUES (?, ?, ?, ?, ?)`;
  const id = uuidv4();

  return new Promise((resolve, reject) => {
    db.query(query, [id, userName, email, password, role], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const getUserByEmail = async (email) => {
  const query = `SELECT * FROM users WHERE email = ? `;
  return new Promise((resolve, reject) => {
    db.query(query, [email], (err, result) => {
      if (err) return reject(err);
      resolve(result.length === 1 ? result[0] : null);
    });
  });
};

const getAllUsers = async () => {
  const query = `SELECT * FROM users`;
  return new Promise((resolve, reject) => {
    db.query(query, [], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const updateUserEmailRole = async (role, allocatedStorage, id) => {
  const query = `UPDATE users SET role=?, allocated_storage=? WHERE id=?`;
  return new Promise((resolve, reject) => {
    db.query(query, [role, allocatedStorage, id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

module.exports = {
  insertUser,
  getUserByEmail,
  getAllUsers,
  updateUserEmailRole,
};
