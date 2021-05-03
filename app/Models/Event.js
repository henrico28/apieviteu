const db = require("../../database");

class Event {
  constructor(data) {
    this.eventTitle = data.eventTitle;
    this.eventSubTitle = data.eventSubTitle;
    this.eventDescription = data.eventDescription;
    this.eventHighlight = data.eventHighlight;
    this.date = data.date;
    this.time = data.time;
    this.location = data.location;
    this.coordinates = data.coordinates;
    this.primaryColor = data.primaryColor;
    this.secondaryColor = data.secondaryColor;
    this.accentColor = data.accentColor;
    this.textColor = data.textColor;
    this.max = data.max;
    this.idHost = data.idHost;
    this.idType = data.idType;
  }

  addEvent(callback) {
    db.query(
      `INSERT INTO eviteu_event(eventTitle, eventSubTitle, eventDescription, eventHighlight, date, time, location, coordinates, primaryColor, secondaryColor,  accentColor, textColor, max, idHost
        , idType) VALUES('${this.eventTitle}', '${this.eventSubTitle}', '${this.eventDescription}', '${this.eventHighlight}', '${this.date}', '${this.time}', '${this.location}', '${this.coordinates}', '${this.primaryColor}', '${this.secondaryColor}', '${this.accentColor}', '${this.textColor}', ${this.max}, ${this.idHost}, ${this.idType})`,
      callback
    );
  }

  updateEvent(idEvent, callback) {
    db.query(
      `UPDATE eviteu_event SET eventTitle = '${this.eventTitle}', eventSubTitle = '${this.eventSubTitle}', eventDescription = '${this.eventDescription}', eventHighlight = '${this.eventHighlight}', date = '${this.date}', time = '${this.time}', location = '${this.location}', coordinates = '${this.coordinates}', primaryColor = '${this.primaryColor}', secondaryColor = '${this.secondaryColor}', accentColor = '${this.accentColor}', textColor = '${this.textColor}', max = ${this.max}, idType = ${this.idType} WHERE idevent = ${idEvent}`,
      callback
    );
  }

  static getMaxIdEvent(callback) {
    db.query(`SELECT MAX(idEvent) as maxIdEvent FROM eviteu_event`, callback);
  }

  static getEventById(idEvent, callback) {
    db.query(`SELECT * FROM eviteu_event WHERE idEvent = ${idEvent}`, callback);
  }

  static getEventByIdEventIdHost(idEvent, idHost, callback) {
    db.query(
      `SELECT * FROM eviteu_event WHERE idEvent = ${idEvent} AND idHost = ${idHost}`,
      callback
    );
  }

  static getAllEventByIdHost(idHost, callback) {
    db.query(
      `SELECT eviteu_event.idEvent, eventTitle, eventSubTitle, eventDescription, eventHighlight, date, time, location, coordinates, primaryColor, secondaryColor, accentColor, textColor, max, idHost, typeName, COUNT(idGuest) AS totalGuestInvited,SUM(status) AS totalGuestRsvp,SUM(qty) AS totalGuestBrought, SUM(attend) AS totalGuestAttended FROM eviteu_guest RIGHT OUTER JOIN eviteu_event ON eviteu_guest.idEvent = eviteu_event.idEvent INNER JOIN eviteu_type ON eviteu_event.idType = eviteu_type.idType WHERE idHost = ${idHost} GROUP BY idEvent`,
      callback
    );
  }

  static getAllEventByIdCommittee(idCommittee, callback) {
    db.query(
      `SELECT eviteu_event.idEvent, eventTitle, eventSubTitle, eventDescription, eventHighlight, date, time, location, coordinates, primaryColor, secondaryColor, accentColor, textColor, max, idHost, typeName FROM eviteu_manage INNER JOIN eviteu_event ON eviteu_manage.idEvent = eviteu_event.idEvent INNER JOIN eviteu_type ON eviteu_event.idType = eviteu_type.idType WHERE idCommittee = ${idCommittee}`,
      callback
    );
  }

  static getAllEventByIdHostIdType(idHost, idType, callback) {
    db.query(
      `SELECT * FROM eviteu_event WHERE idHost = ${idHost} AND idType = ${idType}`,
      callback
    );
  }

  static getAllCommitteeAssignedById(idEvent, callback) {
    db.query(
      `SELECT eviteu_committee.idCommittee, userName, CASE WHEN assignedCommittee.idEvent IS NULL THEN 0 ELSE 1 END AS status FROM (SELECT * FROM eviteu_manage WHERE idEvent = ${idEvent}) AS assignedCommittee RIGHT OUTER JOIN eviteu_committee ON assignedCommittee.idCommittee = eviteu_committee.idCommittee INNER JOIN eviteu_user ON eviteu_committee.idUser = eviteu_user.idUser`,
      callback
    );
  }

  static addAssignCommittee(idEvent, listOfIdCommittee, callback) {
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
  }

  static deleteEventById(idEvent, callback) {
    db.query(`DELETE FROM eviteu_event WHERE idEvent = ${idEvent}`, callback);
  }

  static deleteCommitteeAssignedById(idEvent, callback) {
    db.query(`DELETE FROM eviteu_manage WHERE idEvent = ${idEvent}`, callback);
  }
}

module.exports = Event;
