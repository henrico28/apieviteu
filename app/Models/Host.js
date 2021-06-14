const db = require("../../database");

const addHost = (data, callback) => {
  db.query(
    `INSERT INTO eviteu_host(phoneNumber, idUser) VALUES('${data.phoneNumber}', '${data.idUser}')`,
    callback
  );
};

const getAllHost = (callback) => {
  db.query(
    `SELECT eviteu_user.idUser, userName, userEmail, idHost, phoneNumber, token FROM eviteu_host INNER JOIN eviteu_user ON eviteu_host.idUser = eviteu_user.idUser`,
    callback
  );
};

const getHostById = (idHost, callback) => {
  db.query(
    `SELECT eviteu_user.idUser, userName, userEmail, idHost, phoneNumber, token FROM eviteu_host INNER JOIN eviteu_user ON eviteu_host.idUser = eviteu_user.idUser WHERE idHost = ${idHost}`,
    callback
  );
};

const getHostByUserEmail = (userEmail, callback) => {
  db.query(
    `SELECT eviteu_user.idUser, userName, userEmail, userPassword, idHost FROM eviteu_host INNER JOIN eviteu_user ON eviteu_host.idUser = eviteu_user.idUser WHERE userEmail = '${userEmail}'`,
    callback
  );
};

module.exports = {
  addHost,
  getAllHost,
  getHostById,
  getHostByUserEmail,
};
