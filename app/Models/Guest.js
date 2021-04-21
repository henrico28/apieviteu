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

  static getGuestById(idGuest, callback) {
    db.query(
      `SELECT eviteu_user.idUser, userName, userEmail, idGuest, qty, status, invited, attend, idEvent FROM eviteu_guest INNER JOIN eviteu_user ON eviteu_guest.idUser = eviteu_user.idUser WHERE idGuest = ${idGuest}`,
      callback
    );
  }

  static getGuestByIdGuestIdHost(idGuest, idHost, callback) {
    db.query(
      `SELECT evite_user.idUser, userName, userEmail, idGuest, qty, status, invited, attend, eviteu_event.idEvent FROM eviteu_event INNER JOIN eviteu_guest ON eviteu_event.idEvent = eviteu_guest.idEvent INNER JOIN eviteu_user ON eviteu_guest.idUser = eviteu_user.idUser WHERE idHost = ${idHost} AND idGuest = ${idGuest}`,
      callback
    );
  }

  static getGuestByUserEmail(userEmail, callback) {
    db.query(
      `SELECT eviteu_user.idUser, userName, userEmail, idGuest, qty, status, invited, attend, eviteu_event.idEvent FROM eviteu_guest INNER JOIN eviteu_user ON eviteu_guest.idUser = eviteu_user.idUser WHERE userEmail = ${userEmail}`,
      callback
    );
  }

  static getGuestByUserEmailNotId(userEmail, idGuest, callback) {
    db.query(
      `SELECT eviteu_user.idUser, userName, userEmail, idGuest, qty, status, invited, attend, eviteu_event.idEvent FROM eviteu_guest INNER JOIN eviteu_user ON eviteu_guest.idUser = eviteu_user.idUser WHERE userEmail = ${userEmail} AND idGuest != ${idGuest}`,
      callback
    );
  }

  static getGuestByIdEventEmail(idEvent, userEmail, callback) {
    db.query(
      `SELECT eviteu_user.idUser, userName, userEmail, userPassword, idGuest, qty, status, invited, attend, idEvent FROM eviteu_guest INNER JOIN eviteu_user ON eviteu_guest.idUser = eviteu_user.idUser WHERE idEvent = ${idEvent} AND userEmail = '${userEmail}'`,
      callback
    );
  }

  static getAllGuestByIdEvent(idEvent, callback) {
    db.query(
      `SELECT eviteu_user.idUser, userName, userEmail, idGuest, qty, status, invited, attend, idEvent FROM eviteu_guest INNER JOIN eviteu_user ON eviteu_guest.idUser = eviteu_user.idUser WHERE idEvent = ${idEvent}`,
      callback
    );
  }

  static getAllGuestByIdHostIdEvent(idHost, idEvent, callback) {
    db.query(
      `SELECT eviteu_user.idUser, userName, userEmail, idGuest, qty, status, invited, attend, eviteu_event.idEvent FROM eviteu_event INNER JOIN eviteu_guest ON eviteu_event.idEvent = eviteu_guest.idEvent INNER JOIN eviteu_user ON eviteu_guest.idUser = eviteu_user.idUser WHERE idHost = ${idHost} AND eviteu_event.idEvent = ${idEvent}`,
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
