const db = require("../../database");

const addAnnouncement = (data, callback) => {
  db.query(
    `INSERT INTO eviteu_announcement(announcementTitle, announcementDescription, announcementStatus, idEvent) VALUES('${data.announcementTitle}', '${data.announcementDescription}', ${data.announcementStatus}, ${data.idEvent})`,
    callback
  );
};

const updateAnnoucement = (data, idAnnouncement, callback) => {
  db.query(
    `UPDATE eviteu_announcement SET announcementTitle = '${data.announcementTitle}', announcementDescription = '${data.announcementDescription}', announcementStatus = ${data.announcementStatus} WHERE idAnnouncement = ${idAnnouncement}`,
    callback
  );
};

const updateAnnoucementStatus = (data, idAnnouncement, callback) => {
  db.query(
    `UPDATE eviteu_announcement SET announcementStatus = ${data.announcementStatus} WHERE idAnnouncement = ${idAnnouncement}`,
    callback
  );
};

const getAnnouncementById = (idAnnouncement, callback) => {
  db.query(
    `SELECT * FROM eviteu_announcement WHERE idAnnouncement = ${idAnnouncement}`,
    callback
  );
};

const getAnnouncementByIdAnnouncementIdHost = (
  idAnnouncement,
  idHost,
  callback
) => {
  db.query(
    `SELECT eviteu_announcement.idAnnouncement, announcementTitle, announcementDescription, announcementStatus, eviteu_announcement.idEvent FROM eviteu_event INNER JOIN eviteu_announcement ON eviteu_event.idEvent = eviteu_announcement.idEvent WHERE idHost = ${idHost} AND eviteu_announcement.idAnnouncement = ${idAnnouncement}`,
    callback
  );
};

const getAnnouncementByIdAnnouncementIdEventIdGuest = (
  idAnnouncement,
  idEvent,
  idGuest,
  callback
) => {
  db.query(
    `SELECT idAnnouncement, announcementTitle, announcementDescription, primaryColor, secondaryColor, accentColor, textColor, userEmail, phoneNumber FROM eviteu_announcement INNER JOIN eviteu_event ON eviteu_announcement.idEvent = eviteu_event.idEvent INNER JOIN eviteu_guest ON eviteu_event.idEvent = eviteu_guest.idEvent INNER JOIN eviteu_host ON eviteu_event.idHost = eviteu_host.idHost INNER JOIN eviteu_user ON eviteu_host.idUser = eviteu_user.idUser WHERE idAnnouncement = ${idAnnouncement} AND eviteu_event.idEvent = ${idEvent} AND idGuest = ${idGuest} AND announcementStatus = 1`,
    callback
  );
};

const getAllAnnouncementByIdEvent = (idEvent, callback) => {
  db.query(
    `SELECT * FROM eviteu_announcement WHERE idEvent = ${idEvent}`,
    callback
  );
};

const getAllAnnouncementByIdHostIdEvent = (idHost, idEvent, callback) => {
  db.query(
    `SELECT eviteu_announcement.idAnnouncement, announcementTitle, announcementDescription, announcementStatus, eviteu_announcement.idEvent FROM eviteu_event INNER JOIN eviteu_announcement ON eviteu_event.idEvent = eviteu_announcement.idEvent WHERE idHost = ${idHost} AND eviteu_event.idEvent = ${idEvent}`,
    callback
  );
};

const getAllPublishedAnnoucementByIdEvent = (idEvent, callback) => {
  db.query(
    `SELECT * FROM eviteu_announcement WHERE idEvent = ${idEvent} AND announcementStatus = 1`,
    callback
  );
};

const deleteAnnouncementById = (idAnnouncement, callback) => {
  db.query(
    `DELETE FROM eviteu_announcement WHERE idAnnouncement = ${idAnnouncement}`,
    callback
  );
};

const deleteAnnouncementByIdEvent = (idEvent, callback) => {
  db.query(
    `DELETE FROM eviteu_announcement WHERE idEvent = ${idEvent}`,
    callback
  );
};

module.exports = {
  addAnnouncement,
  updateAnnoucement,
  updateAnnoucementStatus,
  getAnnouncementById,
  getAnnouncementByIdAnnouncementIdHost,
  getAnnouncementByIdAnnouncementIdEventIdGuest,
  getAllAnnouncementByIdEvent,
  getAllAnnouncementByIdHostIdEvent,
  getAllPublishedAnnoucementByIdEvent,
  deleteAnnouncementById,
  deleteAnnouncementByIdEvent,
};
