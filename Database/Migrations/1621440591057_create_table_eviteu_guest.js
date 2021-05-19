module.exports = {
  up: "CREATE TABLE eviteu_guest (idGuest int(11) NOT NULL, qty int(11) NOT NULL, status tinyint(4) NOT NULL, invited tinyint(4) NOT NULL, attend tinyint(4) NOT NULL, idUser int(11) NOT NULL, idEvent int(11) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
  down: "TRUNCATE TABLE eviteu_guest",
};
