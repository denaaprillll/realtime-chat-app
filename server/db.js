const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  port: 3307,
  user: "root",
  password: "",
  database: "chat_app",
});

db.connect((err) => {
  if (err) {
    console.log("Database gagal terhubung");
    console.log(err);
  } else {
    console.log("Database berhasil terhubung");
  }
});

module.exports = db;