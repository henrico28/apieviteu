module.exports = {
  up: "CREATE TABLE eviteu_event (idEvent int(11) NOT NULL, eventTitle varchar(100) NOT NULL, eventSubTitle varchar(100) NOT NULL, eventDescription varchar(500) NOT NULL, eventHighlight varchar(100) NOT NULL, date date NOT NULL, time time NOT NULL, location varchar(150) NOT NULL, coordinates varchar(100) NOT NULL, primaryColor varchar(30) NOT NULL, secondaryColor varchar(30) NOT NULL, accentColor varchar(30) NOT NULL, textColor varchar(30) NOT NULL, max int(11) NOT NULL, idHost int(11) NOT NULL, idType int(11) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
  down: "TRUNCATE TABLE eviteu_event",
};
