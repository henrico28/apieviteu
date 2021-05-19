module.exports = {
  up: "CREATE TABLE eviteu_manage (idEvent int(11) NOT NULL, idCommittee int(11) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
  down: "TRUNCATE TABLE eviteu_manage",
};
