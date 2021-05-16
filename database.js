let mysql = require("mysql");

// MySQL db Connection
let connection = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
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

module.exports = {
  query: query,
  connection: connection,
};
