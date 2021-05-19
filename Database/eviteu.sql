-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 19, 2021 at 06:01 PM
-- Server version: 10.4.16-MariaDB
-- PHP Version: 7.4.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `eviteu`
--

-- --------------------------------------------------------

--
-- Table structure for table `eviteu_announcement`
--

CREATE TABLE `eviteu_announcement` (
  `idAnnouncement` int(11) NOT NULL,
  `announcementTitle` varchar(100) NOT NULL,
  `announcementDescription` varchar(500) NOT NULL,
  `announcementStatus` tinyint(4) NOT NULL,
  `idEvent` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `eviteu_committee`
--

CREATE TABLE `eviteu_committee` (
  `idCommittee` int(11) NOT NULL,
  `active` tinyint(4) NOT NULL,
  `idUser` int(11) NOT NULL,
  `idHost` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `eviteu_event`
--

CREATE TABLE `eviteu_event` (
  `idEvent` int(11) NOT NULL,
  `eventTitle` varchar(100) NOT NULL,
  `eventSubTitle` varchar(100) NOT NULL,
  `eventDescription` varchar(500) NOT NULL,
  `eventHighlight` varchar(100) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `location` varchar(150) NOT NULL,
  `coordinates` varchar(100) NOT NULL,
  `primaryColor` varchar(30) NOT NULL,
  `secondaryColor` varchar(30) NOT NULL,
  `accentColor` varchar(30) NOT NULL,
  `textColor` varchar(30) NOT NULL,
  `max` int(11) NOT NULL,
  `idHost` int(11) NOT NULL,
  `idType` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `eviteu_guest`
--

CREATE TABLE `eviteu_guest` (
  `idGuest` int(11) NOT NULL,
  `qty` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL,
  `invited` tinyint(4) NOT NULL,
  `attend` tinyint(4) NOT NULL,
  `idUser` int(11) NOT NULL,
  `idEvent` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `eviteu_host`
--

CREATE TABLE `eviteu_host` (
  `idHost` int(11) NOT NULL,
  `phoneNumber` varchar(30) NOT NULL,
  `idUser` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `eviteu_manage`
--

CREATE TABLE `eviteu_manage` (
  `idEvent` int(11) NOT NULL,
  `idCommittee` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `eviteu_type`
--

CREATE TABLE `eviteu_type` (
  `idType` int(11) NOT NULL,
  `typeName` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `eviteu_type`
--

INSERT INTO `eviteu_type` (`idType`, `typeName`) VALUES
(1, 'Wedding'),
(2, 'Meeting');

-- --------------------------------------------------------

--
-- Table structure for table `eviteu_user`
--

CREATE TABLE `eviteu_user` (
  `idUser` int(11) NOT NULL,
  `userName` varchar(100) NOT NULL,
  `userEmail` varchar(150) NOT NULL,
  `userPassword` varchar(100) DEFAULT NULL,
  `token` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `eviteu_announcement`
--
ALTER TABLE `eviteu_announcement`
  ADD PRIMARY KEY (`idAnnouncement`),
  ADD KEY `fk_event_announcement_idEvent` (`idEvent`);

--
-- Indexes for table `eviteu_committee`
--
ALTER TABLE `eviteu_committee`
  ADD PRIMARY KEY (`idCommittee`),
  ADD KEY `fk_user_commitee_idUser` (`idUser`),
  ADD KEY `fk_host_committee_idHost` (`idHost`);

--
-- Indexes for table `eviteu_event`
--
ALTER TABLE `eviteu_event`
  ADD PRIMARY KEY (`idEvent`),
  ADD KEY `fk_host_event_idHost` (`idHost`),
  ADD KEY `fk_type_event_idType` (`idType`);

--
-- Indexes for table `eviteu_guest`
--
ALTER TABLE `eviteu_guest`
  ADD PRIMARY KEY (`idGuest`),
  ADD KEY `fk_user_guest_idUser` (`idUser`),
  ADD KEY `fk_event_guest_idEvent` (`idEvent`);

--
-- Indexes for table `eviteu_host`
--
ALTER TABLE `eviteu_host`
  ADD PRIMARY KEY (`idHost`),
  ADD KEY `fk_user_host_idUser` (`idUser`);

--
-- Indexes for table `eviteu_manage`
--
ALTER TABLE `eviteu_manage`
  ADD KEY `fk_event_manage_idEvent` (`idEvent`),
  ADD KEY `fk_committee_manage_idCommittee` (`idCommittee`);

--
-- Indexes for table `eviteu_type`
--
ALTER TABLE `eviteu_type`
  ADD PRIMARY KEY (`idType`);

--
-- Indexes for table `eviteu_user`
--
ALTER TABLE `eviteu_user`
  ADD PRIMARY KEY (`idUser`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `eviteu_announcement`
--
ALTER TABLE `eviteu_announcement`
  MODIFY `idAnnouncement` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `eviteu_committee`
--
ALTER TABLE `eviteu_committee`
  MODIFY `idCommittee` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `eviteu_event`
--
ALTER TABLE `eviteu_event`
  MODIFY `idEvent` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `eviteu_guest`
--
ALTER TABLE `eviteu_guest`
  MODIFY `idGuest` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `eviteu_host`
--
ALTER TABLE `eviteu_host`
  MODIFY `idHost` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `eviteu_type`
--
ALTER TABLE `eviteu_type`
  MODIFY `idType` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `eviteu_user`
--
ALTER TABLE `eviteu_user`
  MODIFY `idUser` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `eviteu_announcement`
--
ALTER TABLE `eviteu_announcement`
  ADD CONSTRAINT `fk_event_announcement_idEvent` FOREIGN KEY (`idEvent`) REFERENCES `eviteu_event` (`idEvent`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `eviteu_committee`
--
ALTER TABLE `eviteu_committee`
  ADD CONSTRAINT `fk_host_committee_idHost` FOREIGN KEY (`idHost`) REFERENCES `eviteu_host` (`idHost`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_user_commitee_idUser` FOREIGN KEY (`idUser`) REFERENCES `eviteu_user` (`idUser`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `eviteu_event`
--
ALTER TABLE `eviteu_event`
  ADD CONSTRAINT `fk_host_event_idHost` FOREIGN KEY (`idHost`) REFERENCES `eviteu_host` (`idHost`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_type_event_idType` FOREIGN KEY (`idType`) REFERENCES `eviteu_type` (`idType`) ON UPDATE CASCADE;

--
-- Constraints for table `eviteu_guest`
--
ALTER TABLE `eviteu_guest`
  ADD CONSTRAINT `fk_event_guest_idEvent` FOREIGN KEY (`idEvent`) REFERENCES `eviteu_event` (`idEvent`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_user_guest_idUser` FOREIGN KEY (`idUser`) REFERENCES `eviteu_user` (`idUser`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `eviteu_host`
--
ALTER TABLE `eviteu_host`
  ADD CONSTRAINT `fk_user_host_idUser` FOREIGN KEY (`idUser`) REFERENCES `eviteu_user` (`idUser`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `eviteu_manage`
--
ALTER TABLE `eviteu_manage`
  ADD CONSTRAINT `fk_committee_manage_idCommittee` FOREIGN KEY (`idCommittee`) REFERENCES `eviteu_committee` (`idCommittee`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_event_manage_idEvent` FOREIGN KEY (`idEvent`) REFERENCES `eviteu_event` (`idEvent`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
