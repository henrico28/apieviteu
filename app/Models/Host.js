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

const getHostByIdHost = (idHost, callback) => {
  db.query(
    `SELECT eviteu_user.idUser, userName, userEmail, idHost, phoneNumber, token FROM eviteu_host INNER JOIN eviteu_user ON eviteu_host.idUser = eviteu_user.idUser WHERE idHost = ${idHost}`,
    callback
  );
};

const getHostByIdUser = (idUser, callback) => {
  db.query(`SELECT * FROM eviteu_host WHERE idUser = ${idUser}`, callback);
};

const getHostByUserEmail = (userEmail, callback) => {
  db.query(
    `SELECT eviteu_user.idUser, userName, userEmail, userPassword, idHost, phoneNumber, token FROM eviteu_host INNER JOIN eviteu_user ON eviteu_host.idUser = eviteu_user.idUser WHERE userEmail = '${userEmail}'`,
    callback
  );
};

module.exports = {
  addHost,
  getAllHost,
  getHostByIdHost,
  getHostByIdUser,
  getHostByUserEmail,
};
