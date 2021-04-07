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
    this.eventPrimary = data.eventPrimary;
    this.eventSecondary = data.eventSecondary;
    this.eventAccent = data.eventAccent;
    this.max = data.max;
    this.idUser = data.idUser;
    this.idType = data.idType;
  }

  addEvent(callback) {
    db.query(
      `INSERT INTO eviteu_event(eventTitle, eventSubTitle, eventDescription, eventHighlight, date, time, location, coordinates, eventPrimary, eventSecondary,  eventAccent, max, idUser, idType) VALUES('${this.eventTitle}', '${this.eventSubTitle}', '${this.eventDescription}', '${this.eventHighlight}', '${this.date}', '${this.time}', '${this.location}', '${this.coordinates}', '${this.eventPrimary}', '${this.eventSecondary}', '${this.eventAccent}', ${this.max}, ${this.idUser}, ${this.idType})`,
      callback
    );
  }

  updateEvent(idEvent, callback) {
    db.query(
      `UPDATE eviteu_event SET eventTitle = '${this.eventTitle}', eventSubTitle = '${this.eventSubTitle}', eventDescription = '${this.eventDescription}', eventHighlight = '${this.eventHighlight}', date = '${this.date}', time = '${this.time}', location = '${this.location}', coordinates = '${this.coordinates}', eventPrimary = '${this.eventPrimary}', eventSecondary = '${this.eventSecondary}', eventAccent = '${this.eventAccent}', max = ${this.max}, idType = ${this.idType} WHERE idevent = ${idEvent}`,
      callback
    );
  }

  static getMaxIdEvent(callback) {
    db.query(`SELECT MAX(idEvent) as maxIdEvent FROM eviteu_event`, callback);
  }

  static getAllEventByIdUser(idUser, callback) {
    db.query(`SELECT * FROM eviteu_event WHERE idUser = ${idUser}`, callback);
  }

  static getEventById(idEvent, callback) {
    db.query(`SELECT * FROM eviteu_event WHERE idEvent = ${idEvent}`, callback);
  }

  static deleteEventById(idEvent, callback) {
    db.query(`DELETE FROM eviteu_event WHERE idEvent = ${idEvent}`, callback);
  }
}

module.exports = Event;
