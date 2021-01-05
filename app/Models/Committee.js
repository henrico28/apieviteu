const db = require("../../database");

class Committee {
  constructor(data) {
    this.committeeName = data.committeeName;
    this.committeeEmail = data.committeeEmail;
    this.committeePassword = data.committeePassword;
    this.idEvent = data.idEvent;
  }

  addCommittee(callback) {
    db.query(
      `INSERT INTO eviteu_committee(committeeName, committeeEmail, committeePassword, idEvent) VALUES('${this.committeeName}', '${this.committeeEmail}', '${this.committeePassword}', ${this.idEvent})`,
      callback
    );
  }

  updateCommittee(idCommittee, callback) {
    db.query(
      `UPDATE eviteu_committee SET committeeName = '${this.committeeName}', committeeEmail = '${this.committeeEmail}', committeePassword = '${this.committeePassword}', idEvent = ${this.idEvent} WHERE idCommittee = ${idCommittee}`,
      callback
    );
  }

  static getAllCommitteeByIdEvent(idEvent, callback) {
    db.query(
      `SELECT * FROM eviteu_committee WHERE idEvent = ${idEvent}`,
      callback
    );
  }

  static getCommitteeById(idCommittee, callback) {
    db.query(
      `SELECT * FROM eviteu_committee WHERE idCommittee = ${idCommittee}`,
      callback
    );
  }

  static getCommitteeByIdEventEmail(idEvent, committeeEmail, callback) {
    db.query(
      `SELECT * FROM eviteu_committee WHERE idEvent = ${idEvent} AND committeeEmail = '${committeeEmail}'`,
      callback
    );
  }

  static deleteCommitteeById(idCommittee, callback) {
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
