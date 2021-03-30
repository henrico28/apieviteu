const db = require("../../database");

class Type {
  static getAllType(callback) {
    db.query(`SELECT * FROM eviteu_type`, callback);
  }
}

module.exports = Type;
