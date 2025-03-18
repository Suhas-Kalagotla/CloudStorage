const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.DB_host,
  user: process.env.DB_user,
  password: process.env.DB_password,
  database: process.env.DB_database,
});

db.connect((err) => {
  if (err) {
    console.log("Error connecting to the database", err);
    return;
  }
  console.log("Connected to mysql database");
});

module.exports = db;
