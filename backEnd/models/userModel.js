const db = require("../db.js");
const { v4: uuidv4 } = require("uuid");

const insertUser = (userName, email, password, role, callback) => {
  const query = `INSERT IGNORE INTO users (id,user_name, email , password,role) VALUES (?, ?, ?, ?, ?)`;
  const id = uuidv4();

  db.query(query, [id, userName, email, password, role], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

const getUserByEmail = (email, callback) => {
  const query = `SELECT * FROM users WHERE email = ? `;
  db.query(query, [email], (err, result) => {
    if (err) return callback(err);
    if (result.length == 0) return callback(null, null);
    callback(null, result[0]);
  });
};

const getAllUsers = (callback) => {
  const query = `SELECT * FROM users`;
  db.query(query, [], (err, result) => {
    if (err) return callback(err);

    callback(null, result);
  });
};

module.exports = { insertUser, getUserByEmail, getAllUsers };
