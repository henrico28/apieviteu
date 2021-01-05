const db = require("../../database");

class Guest {
  constructor(data) {
    this.guestName = data.guestName;
    this.guestEmail = data.guestEmail;
    this.guestPassword = data.guestPassword;
    this.qty = data.qty;
    this.status = data.status;
    this.invited = data.invited;
    this.attend = data.attend;
    this.idEvent = data.idEvent;
  }

  addGuest(callback) {
    db.query(
      `INSERT INTO eviteu_guest(guestName, guestEmail, guestPassword, qty, status, invited, attend, idEvent) VALUES('${this.guestName}', '${this.guestEmail}', '${this.guestPassword}', ${this.qty}, ${this.status}, ${this.invited}, ${this.attend}, ${this.idEvent})`,
      callback
    );
  }

  updateGuest(idGuest, callback) {
    db.query(
      `UPDATE eviteu_guest SET guestName = '${this.guestName}', guestEmail = '${this.guestEmail}', guestPassword = '${this.guestPassword}', qty = ${this.qty}, status = ${this.status}, attend = ${this.attend} WHERE idGuest = ${idGuest} `,
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
    db.query(`SELECT * FROM eviteu_guest WHERE idEvent = ${idEvent}`, callback);
  }

  static getGuestById(idGuest, callback) {
    db.query(`SELECT * FROM eviteu_guest WHERE idGuest = ${idGuest}`, callback);
  }

  static getGuestByIdEventEmail(idEvent, guestEmail, callback) {
    db.query(
      `SELECT * FROM eviteu_guest WHERE idEvent = ${idEvent} AND guestEmail = '${guestEmail}'`,
      callback
    );
  }

  static deleteGuestById(idGuest, callback) {
    db.query(`DELETE FROM eviteu_guest WHERE idGuest = ${idGuest}`, callback);
  }

  static deleteGuestByIdEvent(idEvent, callback) {
    db.query(`DELETE FROM eviteu_guest WHERE idEvent = ${idEvent}`, callback);
  }
}

module.exports = Guest;
