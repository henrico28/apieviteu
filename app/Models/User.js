const db = require("../../database");

class User {
  constructor(data) {
    this.userName = data.userName;
    this.userEmail = data.userEmail;
    this.userPassword = data.userPassword;
    this.token = data.token;
  }

  addUser(callback) {
    db.query(
      `INSERT INTO eviteu_user(userName, userEmail, userPassword) VALUES('${this.userName}', '${this.userEmail}', '${this.userPassword}')`,
      callback
    );
  }

  updateUserToken(idUser, callback) {
    db.query(
      `UPDATE eviteu_user SET token = ${this.token} WHERE idUser = ${idUser}`,
      callback
    );
  }

  static getAllUsers() {
    return `SELECT * FROM eviteu_user`;
  }

  static getAllUsers2(callback) {
    db.query(`SELECT * FROM eviteu_user`, callback);
  }

  static getUserById(idUser, callback) {
    db.query(`SELECT * FROM eviteu_user WHERE idUser = ${idUser}`, callback);
  }

  static getUserByEmail(userEmail, callback) {
    db.query(
      `SELECT * FROM eviteu_user WHERE userEmail = '${userEmail}'`,
      callback
    );
  }
}

module.exports = User;
