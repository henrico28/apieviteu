const db = require("../../database");

class User {
  constructor(data) {
    this.userName = data.userName;
    this.userEmail = data.userEmail;
    this.userPassword = data.userPassword;
  }

  addUser(callback) {
    db.query(
      `INSERT INTO eviteu_user(userName, userEmail, userPassword) VALUES('${this.userName}', '${this.userEmail}', '${this.userPassword}')`,
      callback
    );
  }

  static getAllUsers() {
    return `SELECT * FROM eviteu_user`;
  }

  static getAllUsers2(callback) {
    db.query(`SELECT * FROM eviteu_user`, callback);
  }

  static getUserById(id, callback) {
    db.query(`SELECT * FROM eviteu_user WHERE idUser = ${id}`, callback);
  }

  static getUserByEmail(email, callback) {
    db.query(
      `SELECT * FROM eviteu_user WHERE userEmail = '${email}'`,
      callback
    );
  }
}

module.exports = User;
