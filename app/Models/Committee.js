const db = require("../../database");

class Committee {
  constructor(data) {
    this.active = data.active;
    this.idUser = data.idUser;
    this.idEvent = data.idEvent;
  }

  addCommittee(callback) {
    db.query(
      `INSERT INTO eviteu_committee(active, idUser, idEvent) VALUES(${this.active}, ${this.idUser}, ${this.idEvent})`,
      callback
    );
  }

  updateCommitteeActive(idCommittee, callback) {
    db.query(
      `UPDATE eviteu_committee SET active = ${this.active} WHERE idCommittee = ${idCommittee}`,
      callback
    );
  }

  static getAllCommitteeByIdEvent(idEvent, callback) {
    db.query(
      `SELECT eviteu_user.idUser, userName, userEmail, idCommittee, active, idEvent FROM eviteu_committee INNER JOIN eviteu_user ON eviteu_committee.idUser = eviteu_user.idUser WHERE idEvent = ${idEvent}`,
      callback
    );
  }

  static getCommitteeByIdCommittee(idCommittee, callback) {
    db.query(
      `SELECT eviteu_user.idUser, userName, userEmail, idCommittee, active, idEvent FROM eviteu_committee INNER JOIN eviteu_user ON eviteu_committee.idUser = eviteu_user.idUser WHERE idCommittee = ${idCommittee}`,
      callback
    );
  }

  static getCommitteeByIdEventEmail(idEvent, userEmail, callback) {
    db.query(
      `SELECT eviteu_user.idUser, userName, userEmail, userPassword, idCommittee, active, idEvent FROM eviteu_committee INNER JOIN eviteu_user ON eviteu_committee.idUser = eviteu_user.idUser WHERE idEvent = ${idEvent} AND userEmail = '${userEmail}'`,
      callback
    );
  }

  static deleteCommitteeByIdCommittee(idCommittee, callback) {
    db.query(
      `DELETE FROM eviteu_committee WHERE idCommittee = ${idCommittee}`,
      callback
    );
  }

  static deleteCommitteeByIdEvent(idEvent, callback) {
    db.query(
      `DELETE FROM eviteu_committee WHERE idEvent = ${idEvent}`,
      callback
    );
  }
}

module.exports = Committee;
