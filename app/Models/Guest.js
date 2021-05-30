const db = require("../../database");

const addGuest = (data, callback) => {
  db.query(
    `INSERT INTO eviteu_guest(qty, status, invited, attend, idUser, idEvent) VALUES(${data.qty}, ${data.status}, ${data.invited}, ${data.attend}, ${data.idUser}, ${data.idEvent})`,
    callback
  );
};

const updateGuest = (data, idGuest, callback) => {
  db.query(
    `UPDATE eviteu_guest SET qty = ${data.qty}, status = ${data.status}, invited = ${data.invited}, attend = ${data.attend}  WHERE idGuest = ${idGuest} `,
    callback
  );
};

const updateGuestRSVP = (data, idGuest, callback) => {
  db.query(
    `UPDATE eviteu_guest SET qty = ${data.qty}, status = ${data.status} WHERE idGuest = ${idGuest} `,
    callback
  );
};

const updateGuestInvited = (data, idGuest, callback) => {
  db.query(
    `UPDATE eviteu_guest SET invited = ${data.invited} WHERE idGuest = ${idGuest} `,
    callback
  );
};

const updateGuestAttend = (data, idGuest, callback) => {
  db.query(
    `UPDATE eviteu_guest SET attend = ${data.attend} WHERE idGuest = ${idGuest} `,
    callback
  );
};

const getGuestById = (idGuest, callback) => {
  db.query(
    `SELECT eviteu_user.idUser, userName, userEmail, idGuest, qty, status, invited, attend, idEvent FROM eviteu_guest INNER JOIN eviteu_user ON eviteu_guest.idUser = eviteu_user.idUser WHERE idGuest = ${idGuest}`,
    callback
  );
};

const getGuestByIdUser = (idUser, callback) => {
  db.query(`SELECT * FROM eviteu_guest WHERE idUser = ${idUser}`, callback);
};

const getGuestByIdGuestIdHost = (idGuest, idHost, callback) => {
  db.query(
    `SELECT eviteu_user.idUser, userName, userEmail, idGuest, qty, status, invited, attend, eviteu_event.idEvent, eviteu_event.max FROM eviteu_event INNER JOIN eviteu_guest ON eviteu_event.idEvent = eviteu_guest.idEvent INNER JOIN eviteu_user ON eviteu_guest.idUser = eviteu_user.idUser WHERE idHost = ${idHost} AND idGuest = ${idGuest}`,
    callback
  );
};

const getGuestByIdEventId = (idEvent, idGuest, callback) => {
  db.query(
    `SELECT * FROM eviteu_guest WHERE idEvent = ${idEvent} AND idGuest = ${idGuest}`,
    callback
  );
};

const getGuestByUserEmailIdEvent = (userEmail, idEvent, callback) => {
  db.query(
    `SELECT eviteu_user.idUser, userName, userEmail, idGuest, qty, status, invited, attend, idEvent FROM eviteu_guest INNER JOIN eviteu_user ON eviteu_guest.idUser = eviteu_user.idUser WHERE userEmail = '${userEmail}' AND idEvent = ${idEvent}`,
    callback
  );
};

const getGuestByUserEmailIdEventNotId = (
  userEmail,
  idEvent,
  idGuest,
  callback
) => {
  db.query(
    `SELECT eviteu_user.idUser, userName, userEmail, idGuest, qty, status, invited, attend, idEvent FROM eviteu_guest INNER JOIN eviteu_user ON eviteu_guest.idUser = eviteu_user.idUser WHERE userEmail = '${userEmail}' AND idEvent = ${idEvent} AND idGuest != ${idGuest}`,
    callback
  );
};

const getGuestEmailDetailById = (idGuest, callback) => {
  db.query(
    `SELECT eviteu_user.idUser, eviteu_user.userName, eviteu_user.userEmail, userHost.userEmail AS hostEmail, eviteu_host.phoneNumber AS hostPhoneNumber, eviteu_guest.idGuest, eviteu_event.idEvent, eventTitle, eventSubTitle, date, time, location, primaryColor, secondaryColor, accentColor, textColor FROM eviteu_guest INNER JOIN eviteu_user ON eviteu_guest.idUser = eviteu_user.idUser INNER JOIN eviteu_event ON eviteu_guest.idEvent = eviteu_event.idEvent INNER JOIN eviteu_host ON eviteu_event.idHost = eviteu_host.idHost INNER JOIN eviteu_user AS userHost ON eviteu_host.idUser = userHost.idUser WHERE idGuest = ${idGuest}`,
    callback
  );
};

const getAllGuestByIdEvent = (idEvent, callback) => {
  db.query(
    `SELECT eviteu_user.idUser, userName, userEmail, idGuest, qty, status, invited, attend, idEvent FROM eviteu_guest INNER JOIN eviteu_user ON eviteu_guest.idUser = eviteu_user.idUser WHERE idEvent = ${idEvent}`,
    callback
  );
};

const getAllGuestByIdHostIdEvent = (idHost, idEvent, callback) => {
  db.query(
    `SELECT eviteu_user.idUser, userName, userEmail, idGuest, qty, status, invited, attend, eviteu_event.idEvent FROM eviteu_event INNER JOIN eviteu_guest ON eviteu_event.idEvent = eviteu_guest.idEvent INNER JOIN eviteu_user ON eviteu_guest.idUser = eviteu_user.idUser WHERE idHost = ${idHost} AND eviteu_event.idEvent = ${idEvent}`,
    callback
  );
};

const getAllAttendedGuestByIdEvent = (idEvent, callback) => {
  db.query(
    `SELECT eviteu_user.idUser, userName, userEmail, idGuest, qty, status, invited, attend, idEvent FROM eviteu_guest INNER JOIN eviteu_user ON eviteu_guest.idUser = eviteu_user.idUser WHERE eviteu_guest.idEvent = ${idEvent} and attend = 1`,
    callback
  );
};

const getAllUnivitedGuestByIdHostIdEvent = (idHost, idEvent, callback) => {
  db.query(
    `SELECT eviteu_user.idUser, eviteu_user.userName, eviteu_user.userEmail, userHost.userEmail AS hostEmail, eviteu_host.phoneNumber AS hostPhoneNumber, eviteu_guest.idGuest, eviteu_event.idEvent, eventTitle, eventSubTitle, date, time, location, primaryColor, secondaryColor, accentColor, textColor FROM eviteu_guest INNER JOIN eviteu_user ON eviteu_guest.idUser = eviteu_user.idUser INNER JOIN eviteu_event ON eviteu_guest.idEvent = eviteu_event.idEvent INNER JOIN eviteu_host ON eviteu_event.idHost = eviteu_host.idHost INNER JOIN eviteu_user AS userHost ON eviteu_host.idUser = userHost.idUser WHERE eviteu_event.idHost = ${idHost} AND eviteu_event.idEvent = ${idEvent} AND eviteu_guest.invited = 0`,
    callback
  );
};

const deleteGuestByIdGuest = (idGuest, callback) => {
  db.query(`DELETE FROM eviteu_guest WHERE idGuest = ${idGuest}`, callback);
};

const deleteGuestByIdEvent = (idEvent, callback) => {
  db.query(`DELETE FROM eviteu_guest WHERE idEvent = ${idEvent}`, callback);
};

module.exports = {
  addGuest,
  updateGuest,
  updateGuestRSVP,
  updateGuestInvited,
  updateGuestAttend,
  getGuestById,
  getGuestByIdUser,
  getGuestByIdGuestIdHost,
  getGuestByIdEventId,
  getGuestByUserEmailIdEvent,
  getGuestByUserEmailIdEventNotId,
  getGuestEmailDetailById,
  getAllGuestByIdEvent,
  getAllGuestByIdHostIdEvent,
  getAllAttendedGuestByIdEvent,
  getAllUnivitedGuestByIdHostIdEvent,
  deleteGuestByIdGuest,
  deleteGuestByIdEvent,
};
