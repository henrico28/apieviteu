module.exports = {
  up: "CREATE TABLE eviteu_host (idHost int(11) NOT NULL, phoneNumber varchar(30) NOT NULL, idUser int(11) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
  down: "TRUNCATE TABLE eviteu_host",
};
