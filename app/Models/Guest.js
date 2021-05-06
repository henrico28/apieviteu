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
      `UPDATE eviteu_guest SET qty = ${this.qty}, status = ${this.status}, invited = ${this.invited}, attend = ${this.attend}  WHERE idGuest = ${idGuest} `,
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

  static getGuestByIdUser(idUser, callback) {
    db.query(`SELECT * FROM eviteu_guest WHERE idUser = ${idUser}`, callback);
  }

  static getGuestByIdGuestIdHost(idGuest, idHost, callback) {
    db.query(
      `SELECT eviteu_user.idUser, userName, userEmail, idGuest, qty, status, invited, attend, eviteu_event.idEvent, eviteu_event.max FROM eviteu_event INNER JOIN eviteu_guest ON eviteu_event.idEvent = eviteu_guest.idEvent INNER JOIN eviteu_user ON eviteu_guest.idUser = eviteu_user.idUser WHERE idHost = ${idHost} AND idGuest = ${idGuest}`,
      callback
    );
  }

  static getGuestByUserEmailIdEvent(userEmail, idEvent, callback) {
    db.query(
      `SELECT eviteu_user.idUser, userName, userEmail, idGuest, qty, status, invited, attend, idEvent FROM eviteu_guest INNER JOIN eviteu_user ON eviteu_guest.idUser = eviteu_user.idUser WHERE userEmail = '${userEmail}' AND idEvent = ${idEvent}`,
      callback
    );
  }

  static getGuestByUserEmailIdEventNotId(
    userEmail,
    idEvent,
    idGuest,
    callback
  ) {
    db.query(
      `SELECT eviteu_user.idUser, userName, userEmail, idGuest, qty, status, invited, attend, idEvent FROM eviteu_guest INNER JOIN eviteu_user ON eviteu_guest.idUser = eviteu_user.idUser WHERE userEmail = '${userEmail}' AND idEvent = ${idEvent} AND idGuest != ${idGuest}`,
      callback
    );
  }

  static getGuestEmailDetailById(idGuest, callback) {
    db.query(
      `SELECT eviteu_user.idUser, eviteu_user.userName, eviteu_user.userEmail, userHost.userEmail AS hostEmail, eviteu_host.phoneNumber AS hostPhoneNumber, eviteu_guest.idGuest, eviteu_event.idEvent, eventTitle, eventSubTitle, date, time, location, primaryColor, secondaryColor, accentColor, textColor FROM eviteu_guest INNER JOIN eviteu_user ON eviteu_guest.idUser = eviteu_user.idUser INNER JOIN eviteu_event ON eviteu_guest.idEvent = eviteu_event.idEvent INNER JOIN eviteu_host ON eviteu_event.idHost = eviteu_host.idHost INNER JOIN eviteu_user AS userHost ON eviteu_host.idUser = userHost.idUser WHERE idGuest = ${idGuest}`,
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

  static getAllAttendedGuestByIdHostIdEvent(idHost, idEvent, callback) {
    db.query(
      `SELECT eviteu_user.idUser, userName, userEmail, idGuest, qty, status, invited, attend, eviteu_event.idEvent FROM eviteu_event INNER JOIN eviteu_guest ON eviteu_event.idEvent = eviteu_guest.idEvent INNER JOIN eviteu_user ON eviteu_guest.idUser = eviteu_user.idUser WHERE idHost = ${idHost} AND eviteu_event.idEvent = ${idEvent} AND attend = 1`,
      callback
    );
  }

  static getAllUnivitedGuestByIdHostIdEvent(idHost, idEvent, callback) {
    db.query(
      `SELECT eviteu_user.idUser, eviteu_user.userName, eviteu_user.userEmail, userHost.userEmail AS hostEmail, eviteu_host.phoneNumber AS hostPhoneNumber, eviteu_guest.idGuest, eviteu_event.idEvent, eventTitle, eventSubTitle, date, time, location, primaryColor, secondaryColor, accentColor, textColor FROM eviteu_guest INNER JOIN eviteu_user ON eviteu_guest.idUser = eviteu_user.idUser INNER JOIN eviteu_event ON eviteu_guest.idEvent = eviteu_event.idEvent INNER JOIN eviteu_host ON eviteu_event.idHost = eviteu_host.idHost INNER JOIN eviteu_user AS userHost ON eviteu_host.idUser = userHost.idUser WHERE eviteu_event.idHost = ${idHost} AND eviteu_event.idEvent = ${idEvent} AND eviteu_guest.invited = 0`,
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
