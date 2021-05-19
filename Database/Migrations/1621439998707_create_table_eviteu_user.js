module.exports = {
  up: "CREATE TABLE eviteu_user (idUser int(11) NOT NULL, userName varchar(100) NOT NULL, userEmail varchar(150) NOT NULL, userPassword varchar(100) DEFAULT NULL, token longtext DEFAULT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
  down: "TRUNCATE TABLE eviteu_user",
};
