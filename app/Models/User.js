const db = require("../../database");

const addUser = (data, callback) => {
  db.query(
    `INSERT INTO eviteu_user(userName, userEmail, userPassword) VALUES('${data.userName}', '${data.userEmail}', '${data.userPassword}')`,
    callback
  );
};

const addUserNoPassword = (data, callback) => {
  db.query(
    `INSERT INTO eviteu_user(userName, userEmail) VALUES('${data.userName}', '${data.userEmail}')`,
    callback
  );
};

const updateUser = (data, idUser, callback) => {
  db.query(
    `UPDATE eviteu_user SET userName = '${data.userName}', userEmail = '${data.userEmail}', userPassword = '${data.userPassword}' WHERE idUser = ${idUser}`,
    callback
  );
};

const updateUserPassword = (data, idUser, callback) => {
  db.query(
    `UPDATE eviteu_user SET userPassword = '${data.userPassword}' WHERE idUser = ${idUser}`,
    callback
  );
};

const updateUserToken = (data, idUser, callback) => {
  db.query(
    `UPDATE eviteu_user SET token = '${data.token}' WHERE idUser = ${idUser}`,
    callback
  );
};

const getAllUsers = (callback) => {
  db.query(`SELECT * FROM eviteu_user`, callback);
};

const getUserById = (idUser, callback) => {
  db.query(`SELECT * FROM eviteu_user WHERE idUser = ${idUser}`, callback);
};

const getUserByEmail = (userEmail, callback) => {
  db.query(
    `SELECT * FROM eviteu_user WHERE userEmail ='${userEmail}'`,
    callback
  );
};

const getUserByEmailToken = (userEmail, token, callback) => {
  db.query(
    `SELECT * FROM eviteu_user WHERE userEmail = '${userEmail}' AND token = '${token}'`,
    callback
  );
};

const deleteUserByIdUser = (idUser, callback) => {
  db.query(`DELETE FROM eviteu_user WHERE idUser = ${idUser}`, callback);
};

const deleteUserGuestByIdEvent = (idEvent, callback) => {
  db.query(
    `DELETE FROM eviteu_user WHERE idUser IN (SELECT idUser FROM eviteu_guest WHERE idEvent = ${idEvent})`,
    callback
  );
};

module.exports = {
  addUser,
  addUserNoPassword,
  updateUser,
  updateUserPassword,
  updateUserToken,
  getAllUsers,
  getUserById,
  getUserByEmail,
  getUserByEmailToken,
  deleteUserByIdUser,
  deleteUserGuestByIdEvent,
};
