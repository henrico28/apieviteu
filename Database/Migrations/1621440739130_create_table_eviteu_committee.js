module.exports = {
  up: "CREATE TABLE eviteu_committee (idCommittee int(11) NOT NULL, active tinyint(4) NOT NULL, idUser int(11) NOT NULL, idHost int(11) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
  down: "TRUNCATE TABLE eviteu_committee",
};
