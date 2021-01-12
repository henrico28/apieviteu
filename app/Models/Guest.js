const db = require("../../database");

class Guest {
  constructor(data) {
    this.qty = data.qty;
    this.status = data.status;
    this.invited = data.invited;
    this.attend = data.attend;
    this.idUser = data.idUser;
    this.idEvent = data.idEvent;
  }

  addGuest(callback) {
    db.query(
      `INSERT INTO eviteu_guest(qty, status, invited, attend, idUser, idEvent) VALUES(${this.qty}, ${this.status}, ${this.invited}, ${this.attend}, ${this.idUser}, ${this.idEvent})`,
      callback
    );
  }

  updateGuest(idGuest, callback) {
    db.query(
      `UPDATE eviteu_guest SET qty = ${this.qty}, status = ${this.status}, attend = ${this.attend} WHERE idGuest = ${idGuest} `,
      callback
    );
  }

  updateGuestRSVP(idGuest, callback) {
    db.query(
      `UPDATE eviteu_guest SET qty = ${this.qty}, status = ${this.status} WHERE idGuest = ${idGuest} `,
      callback
    );
  }

  updateGuestInvited(idGuest, callback) {
    db.query(
      `UPDATE eviteu_guest SET invited = ${this.invited} WHERE idGuest = ${idGuest} `,
      callback
    );
  }

  updateGuestAttend(idGuest, callback) {
    db.query(
      `UPDATE eviteu_guest SET attend = ${this.attend} WHERE idGuest = ${idGuest} `,
      callback
    );
  }

  static getAllGuestByIdEvent(idEvent, callback) {
    db.query(
      `SELECT eviteu_user.idUser, userName, userEmail, idGuest, qty, status, invited, attend, idEvent FROM eviteu_guest INNER JOIN eviteu_user ON eviteu_guest.idUser = eviteu_user.idUser WHERE idEvent = ${idEvent}`,
      callback
    );
  }

  static getGuestByIdGuest(idGuest, callback) {
    db.query(
      `SELECT eviteu_user.idUser, userName, userEmail, idGuest, qty, status, invited, attend, idEvent FROM eviteu_guest INNER JOIN eviteu_user ON eviteu_guest.idUser = eviteu_user.idUser WHERE idGuest = ${idGuest}`,
      callback
    );
  }

  static getGuestByIdEventEmail(idEvent, userEmail, callback) {
    db.query(
      `SELECT eviteu_user.idUser, userName, userEmail, userPassword, idGuest, qty, status, invited, attend, idEvent FROM eviteu_guest INNER JOIN eviteu_user ON eviteu_guest.idUser = eviteu_user.idUser WHERE idEvent = ${idEvent} AND userEmail = '${userEmail}'`,
      callback
    );
  }

  static deleteGuestByIdGuest(idGuest, callback) {
    db.query(`DELETE FROM eviteu_guest WHERE idGuest = ${idGuest}`, callback);
  }

  static deleteGuestByIdEvent(idEvent, callback) {
    db.query(`DELETE FROM eviteu_guest WHERE idEvent = ${idEvent}`, callback);
  }
}

module.exports = Guest;
