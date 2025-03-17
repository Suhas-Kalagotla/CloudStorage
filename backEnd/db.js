const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "cloud",
  password: "cloud@7396",
  database: "metadata",
});

db.connect((err) => {
  if (err) {
    console.log("Error connecting to the database", err);
    return;
  }
  console.log("Connected to mysql database");
});

module.exports = db;
