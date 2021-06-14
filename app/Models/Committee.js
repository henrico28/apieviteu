const db = require("../../database");

const addCommittee = (data, callback) => {
  db.query(
    `INSERT INTO eviteu_committee(active, idUser, idHost) VALUES(${data.active}, ${data.idUser}, ${data.idHost})`,
    callback
  );
};

const updateCommitteeActive = (data, idCommittee, callback) => {
  db.query(
    `UPDATE eviteu_committee SET active = ${data.active} WHERE idCommittee = ${idCommittee}`,
    callback
  );
};

const getCommitteeById = (idCommittee, callback) => {
  db.query(
    `SELECT eviteu_user.idUser, userName, userEmail, idCommittee, active, idHost FROM eviteu_committee INNER JOIN eviteu_user ON eviteu_committee.idUser = eviteu_user.idUser WHERE idCommittee = ${idCommittee}`,
    callback
  );
};

const getCommitteeByUserEmail = (userEmail, callback) => {
  db.query(
    `SELECT eviteu_user.idUser, userName, userEmail, userPassword, idCommittee FROM eviteu_committee INNER JOIN eviteu_user ON eviteu_committee.iduser = eviteu_user.idUser WHERE userEmail = '${userEmail}' AND active = 1`,
    callback
  );
};

const getCommitteeByIdCommitteeIdHost = (idCommittee, idHost, callback) => {
  db.query(
    `SELECT eviteu_user.idUser, userName, userEmail, idCommittee, active, idHost FROM eviteu_committee INNER JOIN eviteu_user ON eviteu_committee.idUser = eviteu_user.idUser WHERE idCommittee = ${idCommittee} AND idHost = ${idHost}`,
    callback
  );
};

const getCommitteeByIdEvent = (idEvent, callback) => {
  db.query(
    `SELECT eviteu_user.idUser, userName, userEmail, eviteu_committee.idCommittee, active, eviteu_committee.idHost FROM eviteu_committee INNER JOIN eviteu_user ON eviteu_committee.idUser = eviteu_user.idUser INNER JOIN eviteu_manage ON eviteu_committee.idCommittee = eviteu_manage.idCommittee INNER JOIN eviteu_event ON eviteu_manage.idEvent = eviteu_event.idEvent WHERE eviteu_event.idEvent = ${idEvent}`,
    callback
  );
};

const getCommitteeByUserEmailIdHost = (userEmail, idHost, callback) => {
  db.query(
    `SELECT eviteu_user.idUser, userName, userEmail, userPassword, idCommittee, active, idHost, token FROM eviteu_committee INNER JOIN eviteu_user ON eviteu_committee.idUser = eviteu_user.idUser WHERE userEmail = '${userEmail}' AND idHost = ${idHost}`,
    callback
  );
};

const getCommitteeByUserEmailIdHostNotId = (
  userEmail,
  idHost,
  idCommittee,
  callback
) => {
  db.query(
    `SELECT eviteu_user.idUser, userName, userEmail, idCommittee, active, idHost, token FROM eviteu_committee INNER JOIN eviteu_user ON eviteu_committee.idUser = eviteu_user.idUser WHERE userEmail = '${userEmail}' AND idHost = ${idHost} AND idCommittee != ${idCommittee}`,
    callback
  );
};

const getCommitteeEmailDetailById = (idCommittee, callback) => {
  db.query(
    `SELECT eviteu_user.idUser, eviteu_user.userName, eviteu_user.userEmail, userHost.userEmail AS hostEmail, eviteu_host.phoneNumber AS hostPhoneNumber, eviteu_committee.idCommittee FROM eviteu_committee INNER JOIN eviteu_user ON eviteu_committee.idUser = eviteu_user.idUser INNER JOIN eviteu_host ON eviteu_committee.idHost = eviteu_host.idHost INNER JOIN eviteu_user AS userHost ON eviteu_host.idUser = userHost.idUser WHERE idCommittee = ${idCommittee}`,
    callback
  );
};

const getAllCommitteeByIdHost = (idHost, callback) => {
  db.query(
    `SELECT eviteu_user.idUser, userName, userEmail, idCommittee, active, idHost FROM eviteu_committee INNER JOIN eviteu_user ON eviteu_committee.idUser = eviteu_user.idUser WHERE idHost = ${idHost}`,
    callback
  );
};

const getAllAssignedEventByIdHostId = (idHost, idCommittee, callback) => {
  db.query(
    `SELECT eviteu_event.idEvent, eventTitle, CASE WHEN assignedEvent.idCommittee IS NULL THEN 0 ELSE 1 END AS status FROM (SELECT * FROM eviteu_manage WHERE idCommittee = ${idCommittee}) as assignedEvent RIGHT OUTER JOIN eviteu_event ON assignedEvent.idEvent = eviteu_event.idEvent WHERE idHost = ${idHost}`,
    callback
  );
};

const getAllUnactiveCommitteeByIdHost = (idHost, callback) => {
  db.query(
    `SELECT eviteu_user.idUser, eviteu_user.userName, eviteu_user.userEmail, userHost.userEmail AS hostEmail, eviteu_host.phoneNumber AS hostPhoneNumber, eviteu_committee.idCommittee FROM eviteu_committee INNER JOIN eviteu_user ON eviteu_committee.idUser = eviteu_user.idUser INNER JOIN eviteu_host ON eviteu_committee.idHost = eviteu_host.idHost INNER JOIN eviteu_user AS userHost ON eviteu_host.idUser = userHost.idUser WHERE eviteu_committee.idHost = ${idHost} AND eviteu_committee.active = 0`,
    callback
  );
};

const addAssignEvent = (idCommittee, listOfIdEvent, callback) => {
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
};

const deleteCommitteeByIdCommittee = (idCommittee, callback) => {
  db.query(
    `DELETE FROM eviteu_committee WHERE idCommittee = ${idCommittee}`,
    callback
  );
};

const deleteEventAssignedById = (idCommittee, callback) => {
  db.query(
    `DELETE FROM eviteu_manage WHERE idCommittee = ${idCommittee}`,
    callback
  );
};

module.exports = {
  addCommittee,
  updateCommitteeActive,
  getCommitteeById,
  getCommitteeByUserEmail,
  getCommitteeByIdCommitteeIdHost,
  getCommitteeByIdEvent,
  getCommitteeByUserEmailIdHost,
  getCommitteeByUserEmailIdHostNotId,
  getCommitteeEmailDetailById,
  getAllCommitteeByIdHost,
  getAllAssignedEventByIdHostId,
  getAllUnactiveCommitteeByIdHost,
  addAssignEvent,
  deleteCommitteeByIdCommittee,
  deleteEventAssignedById,
};
