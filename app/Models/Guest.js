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

  updateGuest(id, callback) {
    db.query(
      `UPDATE eviteu_guest SET guestName = '${this.guestName}', guestEmail = '${this.guestEmail}', guestPassword = '${this.guestPassword}', qty = ${this.qty}, status = ${this.status}, attend = ${this.attend} WHERE idGuest = ${id} `,
      callback
    );
  }

  updateGuestRSVP(id, callback) {
    db.query(
      `UPDATE eviteu_guest SET qty = ${this.qty}, status = ${this.status} WHERE idGuest = ${id} `,
      callback
    );
  }

  updateGuestInvited(id, callback) {
    db.query(
      `UPDATE eviteu_guest SET invited = ${this.invited} WHERE idGuest = ${id} `,
      callback
    );
  }

  updateGuestAttend(id, callback) {
    db.query(
      `UPDATE eviteu_guest SET attend = ${this.attend} WHERE idGuest = ${id} `,
      callback
    );
  }

  static getAllGuestByIdEvent(idEvent, callback) {
    db.query(`SELECT * FROM eviteu_guest WHERE idEvent = ${idEvent}`, callback);
  }

  static getGuestById(id, callback) {
    db.query(`SELECT * FROM eviteu_guest WHERE idGuest = ${id}`, callback);
  }

  static getGuestByIdEventEmail(idEvent, email, callback) {
    db.query(
      `SELECT * FROM eviteu_guest WHERE idEvent = ${idEvent} AND guestEmail = '${email}'`,
      callback
    );
  }

  static deleteGuestById(id, callback) {
    db.query(`DELETE FROM eviteu_guest WHERE idGuest = ${id}`, callback);
  }

  static deleteGuestByIdEvent(id, callback) {
    db.query(`DELETE FROM eviteu_guest WHERE idEvent = ${id}`, callback);
  }
}

module.exports = Guest;
