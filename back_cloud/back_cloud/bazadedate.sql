use test;
CREATE TABLE `appointment` (
`id`	INT PRIMARY KEY AUTO_INCREMENT,
`firstName`         VARCHAR(30),
`lastName`         VARCHAR(30),
`cnp`         VARCHAR(15),
`phoneNumber`         VARCHAR(20),
`appointmentDate` 	DATE,
`appointmentTime` 		DATE,
`standardPackage`		INT,
`bloodType`		VARCHAR(5)
);