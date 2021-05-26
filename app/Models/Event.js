const db = require("../../database");

const addEvent = (data, callback) => {
  db.query(
    `INSERT INTO eviteu_event(eventTitle, eventSubTitle, eventDescription, eventHighlight, date, time, location, coordinates, primaryColor, secondaryColor,  accentColor, textColor, max, idHost
      , idType) VALUES('${data.eventTitle}', '${data.eventSubTitle}', '${data.eventDescription}', '${data.eventHighlight}', '${data.date}', '${data.time}', '${data.location}', '${data.coordinates}', '${data.primaryColor}', '${data.secondaryColor}', '${data.accentColor}', '${data.textColor}', ${data.max}, ${data.idHost}, ${data.idType})`,
    callback
  );
};

const updateEvent = (data, idEvent, callback) => {
  db.query(
    `UPDATE eviteu_event SET eventTitle = '${data.eventTitle}', eventSubTitle = '${data.eventSubTitle}', eventDescription = '${data.eventDescription}', eventHighlight = '${data.eventHighlight}', date = '${data.date}', time = '${data.time}', location = '${data.location}', coordinates = '${data.coordinates}', primaryColor = '${data.primaryColor}', secondaryColor = '${data.secondaryColor}', accentColor = '${data.accentColor}', textColor = '${data.textColor}', max = ${data.max}, idType = ${data.idType} WHERE idevent = ${idEvent}`,
    callback
  );
};

const getMaxIdEvent = (callback) => {
  db.query(`SELECT MAX(idEvent) as maxIdEvent FROM eviteu_event`, callback);
};

const getEventById = (idEvent, callback) => {
  db.query(`SELECT * FROM eviteu_event WHERE idEvent = ${idEvent}`, callback);
};

const getEventByIdEventIdHost = (idEvent, idHost, callback) => {
  db.query(
    `SELECT idEvent, eventTitle, eventSubTitle, eventDescription, eventHighlight, date, time, location, coordinates, primaryColor, secondaryColor, accentColor, textColor, max, eviteu_host.idHost, idType, eviteu_user.idUser, userName, userEmail, eviteu_host.idHost, phoneNumber  FROM eviteu_event INNER JOIN eviteu_host ON eviteu_event.idHost = eviteu_host.idHost INNER JOIN eviteu_user ON eviteu_host.idUser = eviteu_user.idUser WHERE idEvent = ${idEvent} AND eviteu_host.idHost = ${idHost}`,
    callback
  );
};

const getEventDetailByIdEventIdGuest = (idEvent, idGuest, callback) => {
  db.query(
    `SELECT eviteu_event.idEvent, eventTitle, eventSubTitle, eventDescription, eventHighlight, date, time, location, coordinates, primaryColor, secondaryColor, accentColor, textColor, max, userEmail, phoneNumber, eviteu_guest.idUser, idGuest, status FROM eviteu_event INNER JOIN eviteu_guest ON eviteu_event.idEvent = eviteu_guest.idEvent INNER JOIN eviteu_host ON eviteu_event.idHost = eviteu_host.idHost INNER JOIN eviteu_user ON eviteu_host.idUser = eviteu_user.idUser WHERE eviteu_event.idEvent = ${idEvent} AND eviteu_guest.idGuest = ${idGuest}`,
    callback
  );
};

const getEventManageByCommittee = (idEvent, idCommittee, callback) => {
  db.query(
    `SELECT * FROM eviteu_manage WHERE idEvent = ${idEvent} AND idCommittee = ${idCommittee}`,
    callback
  );
};

const getAllEventByIdHost = (idHost, callback) => {
  db.query(
    `SELECT eviteu_event.idEvent, eventTitle, eventSubTitle, eventDescription, eventHighlight, date, time, location, coordinates, primaryColor, secondaryColor, accentColor, textColor, max, idHost, typeName, COUNT(idGuest) AS totalGuestInvited,SUM(status) AS totalGuestRsvp,SUM(qty) AS totalGuestBrought, SUM(attend) AS totalGuestAttended FROM eviteu_guest RIGHT OUTER JOIN eviteu_event ON eviteu_guest.idEvent = eviteu_event.idEvent INNER JOIN eviteu_type ON eviteu_event.idType = eviteu_type.idType WHERE idHost = ${idHost} GROUP BY idEvent`,
    callback
  );
};

const getAllEventByIdCommittee = (idCommittee, callback) => {
  db.query(
    `SELECT eviteu_event.idEvent, eventTitle, eventSubTitle, eventDescription, eventHighlight, date, time, location, coordinates, primaryColor, secondaryColor, accentColor, textColor, max, idHost, typeName FROM eviteu_manage INNER JOIN eviteu_event ON eviteu_manage.idEvent = eviteu_event.idEvent INNER JOIN eviteu_type ON eviteu_event.idType = eviteu_type.idType WHERE idCommittee = ${idCommittee}`,
    callback
  );
};

const getAllCommitteeAssignedByIdHostId = (idHost, idEvent, callback) => {
  db.query(
    `SELECT eviteu_committee.idCommittee, userName, CASE WHEN assignedCommittee.idEvent IS NULL THEN 0 ELSE 1 END AS status FROM (SELECT * FROM eviteu_manage WHERE idEvent = ${idEvent}) AS assignedCommittee RIGHT OUTER JOIN eviteu_committee ON assignedCommittee.idCommittee = eviteu_committee.idCommittee INNER JOIN eviteu_user ON eviteu_committee.idUser = eviteu_user.idUser WHERE idHost = ${idHost}`,
    callback
  );
};

const addAssignCommittee = (idEvent, listOfIdCommittee, callback) => {
  let query = "INSERT INTO eviteu_manage(idEvent, idCommittee) VALUES";
  let flag = true;
  listOfIdCommittee.forEach((idCommittee) => {
    if (flag) {
      query += `(${idEvent}, ${idCommittee})`;
      flag = false;
    } else {
      query += `,(${idEvent}, ${idCommittee})`;
    }
  });
  db.query(query, callback);
};

const deleteEventById = (idEvent, callback) => {
  db.query(`DELETE FROM eviteu_event WHERE idEvent = ${idEvent}`, callback);
};

const deleteCommitteeAssignedById = (idEvent, callback) => {
  db.query(`DELETE FROM eviteu_manage WHERE idEvent = ${idEvent}`, callback);
};

module.exports = {
  addEvent,
  updateEvent,
  getMaxIdEvent,
  getEventById,
  getEventByIdEventIdHost,
  getEventDetailByIdEventIdGuest,
  getEventManageByCommittee,
  getAllEventByIdHost,
  getAllEventByIdCommittee,
  getAllCommitteeAssignedByIdHostId,
  addAssignCommittee,
  deleteEventById,
  deleteCommitteeAssignedById,
};
