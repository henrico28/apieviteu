const db = require("../../database");

class Announcement {
  constructor(data) {
    this.announcementTitle = data.announcementTitle;
    this.announcementDescription = data.announcementDescription;
    this.announcementStatus = data.announcementStatus;
    this.idEvent = data.idEvent;
  }

  addAnnouncement(callback) {
    db.query(
      `INSERT INTO eviteu_announcement(announcementTitle, announcementDescription, announcementStatus, idEvent) VALUES('${this.announcementTitle}', '${this.announcementDescription}', ${this.announcementStatus}, ${this.idEvent})`,
      callback
    );
  }

  updateAnnoucement(idAnnouncement, callback) {
    db.query(
      `UPDATE eviteu_announcement SET announcementTitle = '${this.announcementTitle}', announcementDescription = '${this.announcementDescription}', announcementStatus = ${this.announcementStatus} WHERE idAnnouncement = ${idAnnouncement}`,
      callback
    );
  }

  updateAnnoucementStatus(idAnnouncement, callback) {
    db.query(
      `UPDATE eviteu_announcement SET announcementStatus = ${this.announcementStatus} WHERE idAnnouncement = ${idAnnouncement}`,
      callback
    );
  }

  static getAnnouncementById(idAnnouncement, callback) {
    db.query(
      `SELECT * FROM eviteu_announcement WHERE idAnnouncement = ${idAnnouncement}`,
      callback
    );
  }

  static getAnnouncementByIdAnnouncementIdHost(
    idAnnouncement,
    idHost,
    callback
  ) {
    db.query(
      `SELECT eviteu_announcement.idAnnouncement, announcementTitle, announcementDescription, announcementStatus, eviteu_announcement.idEvent FROM eviteu_event INNER JOIN eviteu_announcement ON eviteu_event.idEvent = eviteu_announcement.idEvent WHERE idHost = ${idHost} AND eviteu_announcement.idAnnouncement = ${idAnnouncement}`,
      callback
    );
  }

  static getAnnouncementByIdAnnouncementIdEventIdGuest(
    idAnnouncement,
    idEvent,
    idGuest,
    callback
  ) {
    db.query(
      `SELECT idAnnouncement, announcementTitle, announcementDescription, primaryColor, secondaryColor, accentColor, textColor, userEmail, phoneNumber FROM eviteu_announcement INNER JOIN eviteu_event ON eviteu_announcement.idEvent = eviteu_event.idEvent INNER JOIN eviteu_guest ON eviteu_event.idEvent = eviteu_guest.idEvent INNER JOIN eviteu_host ON eviteu_event.idHost = eviteu_host.idHost INNER JOIN eviteu_user ON eviteu_host.idUser = eviteu_user.idUser WHERE idAnnouncement = ${idAnnouncement} AND eviteu_event.idEvent = ${idEvent} AND idGuest = ${idGuest} AND announcementStatus = 1`,
      callback
    );
  }

  static getAllAnnouncementByIdEvent(idEvent, callback) {
    db.query(
      `SELECT * FROM eviteu_announcement WHERE idEvent = ${idEvent}`,
      callback
    );
  }

  static getAllAnnouncementByIdHostIdEvent(idHost, idEvent, callback) {
    db.query(
      `SELECT eviteu_announcement.idAnnouncement, announcementTitle, announcementDescription, announcementStatus, eviteu_announcement.idEvent FROM eviteu_event INNER JOIN eviteu_announcement ON eviteu_event.idEvent = eviteu_announcement.idEvent WHERE idHost = ${idHost} AND eviteu_event.idEvent = ${idEvent}`,
      callback
    );
  }

  static getAllPublishedAnnoucementByIdEvent(idEvent, callback) {
    db.query(
      `SELECT * FROM eviteu_announcement WHERE idEvent = ${idEvent} AND announcementStatus = 1`,
      callback
    );
  }

  static deleteAnnouncementById(idAnnouncement, callback) {
    db.query(
      `DELETE FROM eviteu_announcement WHERE idAnnouncement = ${idAnnouncement}`,
      callback
    );
  }

  static deleteAnnouncementByIdEvent(idEvent, callback) {
    db.query(
      `DELETE FROM eviteu_announcement WHERE idEvent = ${idEvent}`,
      callback
    );
  }
}

module.exports = Announcement;
