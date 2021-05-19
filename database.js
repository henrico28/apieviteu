let mysql = require("mysql");
let migration = require("mysql-migrations");

// MySQL db Connection
let connection = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "eviteu",
});

function executeQuery(sql, callback) {
  connection.getConnection((err, connection) => {
    if (err) {
      return callback(err, null);
    } else {
      if (connection) {
        connection.query(sql, function (error, results, fields) {
          connection.release();
          if (error) {
            return callback(error, null);
          }
          return callback(null, results);
        });
      }
    }
  });
}

function query(sql, callback) {
  executeQuery(sql, function (err, data) {
    if (err) {
      return callback(err);
    }
    return callback(null, data);
  });
}

migration.init(connection, __dirname + "/Database/Migrations");

module.exports = {
  query: query,
  connection: connection,
};
