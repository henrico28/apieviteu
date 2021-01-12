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
      `SELECT eviteu_user.idUser, userName, userEmail, userPassword, idHost, phoneNumber, token FROM eviteu_host INNER JOIN eviteu_user ON eviteu_host.idUser = eviteu_user.idUser`,
      callback
    );
  }

  static getHostById(idUser, callback) {
    db.query(
      `SELECT eviteu_user.idUser, userName, userEmail, userPassword, idHost, phoneNumber, token FROM eviteu_host INNER JOIN eviteu_user ON eviteu_host.idUser = eviteu_user.idUser WHERE idHost = ${idUser}`,
      callback
    );
  }
}

module.exports = Host;
