const db = require("../../database");

class Host {
  constructor(data) {
    this.phoneNumber = data.phoneNumber;
    this.idUser = data.idUser;
  }

  addHost(callback) {
    db.query(
      `INSERT INTO eviteu_host(phoneNumber, idUser) VALUES('${this.phoneNumber}', '${this.idUser}')`,
      callback
    );
  }

  static getAllHost(callback) {
    db.query(
      `SELECT eviteu_user.idUser, userName, userEmail, idHost, phoneNumber, token FROM eviteu_host INNER JOIN eviteu_user ON eviteu_host.idUser = eviteu_user.idUser`,
      callback
    );
  }

  static getHostByIdHost(idHost, callback) {
    db.query(
      `SELECT eviteu_user.idUser, userName, userEmail, idHost, phoneNumber, token FROM eviteu_host INNER JOIN eviteu_user ON eviteu_host.idUser = eviteu_user.idUser WHERE idHost = ${idHost}`,
      callback
    );
  }

  static getHostByIdUser(idUser, callback) {
    db.query(`SELECT * FROM eviteu_host WHERE idUser = ${idUser}`, callback);
  }

  static getHostByUserEmail(userEmail, callback) {
    db.query(
      `SELECT eviteu_user.idUser, userName, userEmail, userPassword, idHost, phoneNumber, token FROM eviteu_host INNER JOIN eviteu_user ON eviteu_host.idUser = eviteu_user.idUser WHERE userEmail = '${userEmail}'`,
      callback
    );
  }
}

module.exports = Host;
