module.exports = {
  up: "CREATE TABLE eviteu_type (idType int(11) NOT NULL, typeName varchar(100) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
  down: "TRUNCATE TABLE eviteu_type",
};
