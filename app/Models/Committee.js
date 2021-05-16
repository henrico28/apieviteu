const db = require("../../database");

class Committee {
  constructor(data) {
    this.active = data.active;
    this.idUser = data.idUser;
    this.idHost = data.idHost;
  }

  addCommittee(callback) {
    db.query(
      `INSERT INTO eviteu_committee(active, idUser, idHost) VALUES(${this.active}, ${this.idUser}, ${this.idHost})`,
      callback
    );
  }

  updateCommitteeActive(idCommittee, callback) {
    db.query(
      `UPDATE eviteu_committee SET active = ${this.active} WHERE idCommittee = ${idCommittee}`,
      callback
    );
  }

  static getCommitteeById(idCommittee, callback) {
    db.query(
      `SELECT eviteu_user.idUser, userName, userEmail, idCommittee, active, idHost FROM eviteu_committee INNER JOIN eviteu_user ON eviteu_committee.idUser = eviteu_user.idUser WHERE idCommittee = ${idCommittee}`,
      callback
    );
  }

  static getCommitteeByIdUser(idUser, callback) {
    db.query(
      `SELECT * FROM eviteu_committee WHERE idUser = ${idUser}`,
      callback
    );
  }

  static getCommitteeByIdCommitteeIdHost(idCommittee, idHost, callback) {
    db.query(
      `SELECT eviteu_user.idUser, userName, userEmail, idCommittee, active, idHost FROM eviteu_committee INNER JOIN eviteu_user ON eviteu_committee.idUser = eviteu_user.idUser WHERE idCommittee = ${idCommittee} AND idHost = ${idHost}`,
      callback
    );
  }

  static getCommitteeByIdEvent(idEvent, callback) {
    db.query(
      `SELECT eviteu_user.idUser, userName, userEmail, eviteu_committee.idCommittee, active, eviteu_committee.idHost FROM eviteu_committee INNER JOIN eviteu_user ON eviteu_committee.idUser = eviteu_user.idUser INNER JOIN eviteu_manage ON eviteu_committee.idCommittee = eviteu_manage.idCommittee INNER JOIN eviteu_event ON eviteu_manage.idEvent = eviteu_event.idEvent WHERE eviteu_event.idEvent = ${idEvent}`,
      callback
    );
  }

  static getCommitteeByUserEmailIdHost(userEmail, idHost, callback) {
    db.query(
      `SELECT eviteu_user.idUser, userName, userEmail, userPassword, idCommittee, active, idHost, token FROM eviteu_committee INNER JOIN eviteu_user ON eviteu_committee.idUser = eviteu_user.idUser WHERE userEmail = '${userEmail}' AND idHost = ${idHost}`,
      callback
    );
  }

  static getCommitteeByUserEmailIdHostNotId(
    userEmail,
    idHost,
    idCommittee,
    callback
  ) {
    db.query(
      `SELECT eviteu_user.idUser, userName, userEmail, idCommittee, active, idHost, token FROM eviteu_committee INNER JOIN eviteu_user ON eviteu_committee.idUser = eviteu_user.idUser WHERE userEmail = '${userEmail}' AND idHost = ${idHost} AND idCommittee != ${idCommittee}`,
      callback
    );
  }

  static getCommitteeEmailDetailById(idCommittee, callback) {
    db.query(
      `SELECT eviteu_user.idUser, eviteu_user.userName, eviteu_user.userEmail, userHost.userEmail AS hostEmail, eviteu_host.phoneNumber AS hostPhoneNumber, eviteu_committee.idCommittee FROM eviteu_committee INNER JOIN eviteu_user ON eviteu_committee.idUser = eviteu_user.idUser INNER JOIN eviteu_host ON eviteu_committee.idHost = eviteu_host.idHost INNER JOIN eviteu_user AS userHost ON eviteu_host.idUser = userHost.idUser WHERE idCommittee = ${idCommittee}`,
      callback
    );
  }

  static getAllCommitteeByIdHost(idHost, callback) {
    db.query(
      `SELECT eviteu_user.idUser, userName, userEmail, idCommittee, active, idHost FROM eviteu_committee INNER JOIN eviteu_user ON eviteu_committee.idUser = eviteu_user.idUser WHERE idHost = ${idHost}`,
      callback
    );
  }

  static getAllAssignedEventByIdHostId(idHost, idCommittee, callback) {
    db.query(
      `SELECT eviteu_event.idEvent, eventTitle, CASE WHEN assignedEvent.idCommittee IS NULL THEN 0 ELSE 1 END AS status FROM (SELECT * FROM eviteu_manage WHERE idCommittee = ${idCommittee}) as assignedEvent RIGHT OUTER JOIN eviteu_event ON assignedEvent.idEvent = eviteu_event.idEvent WHERE idHost = ${idHost}`,
      callback
    );
  }

  static getAllUnactiveCommitteeByIdHost(idHost, callback) {
    db.query(
      `SELECT eviteu_user.idUser, eviteu_user.userName, eviteu_user.userEmail, userHost.userEmail AS hostEmail, eviteu_host.phoneNumber AS hostPhoneNumber, eviteu_committee.idCommittee FROM eviteu_committee INNER JOIN eviteu_user ON eviteu_committee.idUser = eviteu_user.idUser INNER JOIN eviteu_host ON eviteu_committee.idHost = eviteu_host.idHost INNER JOIN eviteu_user AS userHost ON eviteu_host.idUser = userHost.idUser WHERE eviteu_committee.idHost = ${idHost} AND eviteu_committee.active = 0`,
      callback
    );
  }

  static addAssignEvent(idCommittee, listOfIdEvent, callback) {
    let query = "INSERT INTO eviteu_manage(idEvent, idCommittee) VALUES";
    let flag = true;
    listOfIdEvent.forEach((idEvent) => {
      if (flag) {
        query += `(${idEvent}, ${idCommittee})`;
        flag = false;
      } else {
        query += `,(${idEvent}, ${idCommittee})`;
      }
    });
    db.query(query, callback);
  }

  static deleteCommitteeByIdCommittee(idCommittee, callback) {
    db.query(
      `DELETE FROM eviteu_committee WHERE idCommittee = ${idCommittee}`,
      callback
    );
  }

  static deleteEventAssignedById(idCommittee, callback) {
    db.query(
      `DELETE FROM eviteu_manage WHERE idCommittee = ${idCommittee}`,
      callback
    );
  }
}

module.exports = Committee;
