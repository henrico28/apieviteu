const db = require("../../database");

class Committee {
  constructor(data) {
    this.active = data.active;
    this.idUser = data.idUser;
    this.idHost = data.idHost;
  }

  addCommittee(callback) {
    db.query(
      `INSERT INTO eviteu_committee(active, idUser, idHost) VALUES(${this.active}, ${this.idUser}, ${this.idHost})`,
      callback
    );
  }

  updateCommitteeActive(idCommittee, callback) {
    db.query(
      `UPDATE eviteu_committee SET active = ${this.active} WHERE idCommittee = ${idCommittee}`,
      callback
    );
  }

  static getAllCommitteeByIdHost(idHost, callback) {
    db.query(
      `SELECT eviteu_user.idUser, userName, userEmail, idCommittee, active, idHost FROM eviteu_committee INNER JOIN eviteu_user ON eviteu_committee.idUser = eviteu_user.idUser WHERE idHost = ${idHost}`,
      callback
    );
  }

  static getCommitteeByIdCommitteeIdHost(idCommittee, idHost, callback) {
    db.query(
      `SELECT eviteu_user.idUser, userName, userEmail, idCommittee, active, idHost FROM eviteu_committee INNER JOIN eviteu_user ON eviteu_committee.idUser = eviteu_user.idUser WHERE idCommittee = ${idCommittee} AND idHost = ${idHost}`,
      callback
    );
  }

  static getCommitteeByIdEvent(idEvent, callback) {
    db.query(
      `SELECT eviteu_user.idUser, userName, userEmail, eviteu_committee.idCommittee, active, eviteu_committee.idHost FROM eviteu_committee INNER JOIN eviteu_user ON eviteu_committee.idUser = eviteu_user.idUser INNER JOIN eviteu_manage ON eviteu_committee.idCommittee = eviteu_manage.idCommittee INNER JOIN eviteu_event ON eviteu_manage.idEvent = eviteu_event.idEvent WHERE eviteu_event.idEvent = ${idEvent}`,
      callback
    );
  }

  static getCommitteeByIdEventEmail(idEvent, userEmail, callback) {
    db.query(
      `SELECT eviteu_user.idUser, userName, userEmail, userPassword, idCommittee, active, idEvent FROM eviteu_committee INNER JOIN eviteu_user ON eviteu_committee.idUser = eviteu_user.idUser WHERE idEvent = ${idEvent} AND userEmail = '${userEmail}'`,
      callback
    );
  }

  static getCommitteeByUserEmail(userEmail, callback) {
    db.query(
      `SELECT eviteu_user.idUser, userName, userEmail, userPassword, idCommittee, active, idHost, token FROM eviteu_committee INNER JOIN eviteu_user ON eviteu_committee.idUser = eviteu_user.idUser WEHRE userEmail = '${userEmail}'`,
      callback
    );
  }

  static deleteCommitteeByIdCommittee(idCommittee, callback) {
    db.query(
      `DELETE FROM eviteu_committee WHERE idCommittee = ${idCommittee}`,
      callback
    );
  }
}

module.exports = Committee;
