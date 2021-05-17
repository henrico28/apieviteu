const db = require("../../database");

const getAllType = (callback) => {
  db.query(`SELECT * FROM eviteu_type`, callback);
};

module.exports = {
  getAllType,
};
