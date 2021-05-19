module.exports = {
  up: "CREATE TABLE eviteu_announcement (idAnnouncement int(11) NOT NULL, announcementTitle varchar(100) NOT NULL, announcementDescription varchar(500) NOT NULL, announcementStatus tinyint(4) NOT NULL, idEvent int(11) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
  down: "TRUNCATE TABLE eviteu_announcement",
};
