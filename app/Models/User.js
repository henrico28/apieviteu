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

  addUserNoPassword(callback) {
    db.query(
      `INSERT INTO eviteu_user(userName, userEmail) VALUES('${this.userName}', '${this.userEmail}')`,
      callback
    );
  }

  updateUser(idUser, callback) {
    db.query(
      `UPDATE eviteu_user SET userName = '${this.userName}', userEmail = '${this.userEmail}', userPassword = '${this.userPassword}' WHERE idUser = ${idUser}`,
      callback
    );
  }

  updateUserNameEmail(idUser, callback) {
    db.query(
      `UPDATE eviteu_user SET userName = '${this.userName}', userEmail = '${this.userEmail}' WHERE idUser = ${idUser}`,
      callback
    );
  }

  updateUserPassword(idUser, callback) {
    db.query(
      `UPDATE eviteu_user SET userPassword = '${this.userPassword}' WHERE idUser = ${idUser}`,
      callback
    );
  }

  updateUserToken(idUser, callback) {
    db.query(
      `UPDATE eviteu_user SET token = '${this.token}' WHERE idUser = ${idUser}`,
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

  static deleteUserByIdUser(idUser, callback) {
    db.query(`DELETE FROM eviteu_user WHERE idUser = ${idUser}`, callback);
  }
}

module.exports = User;
