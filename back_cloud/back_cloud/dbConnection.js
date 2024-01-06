const mysql = require("mysql2");

const db_connection = mysql
  .createConnection({
    host: "myDB",
    user: "root", // USER NAME
    database: "pweb", // DATABASE NAME
    password: "1234", // DATABASE PASSWORD
    port: "3307"
  })
  .on("error", (err) => {
    console.log("Failed to connect to Database - ", err);
  });

module.exports = db_connection;