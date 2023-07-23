var mysql = require("mysql");

var pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "112233",
  database: "gwaliorbasket",
  multipleStatements: true,
  connectionLimit: 100,
});

module.exports = pool;
