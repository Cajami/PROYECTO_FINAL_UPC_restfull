-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- VersiÃ³n del servidor:         10.2.6-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win64
-- HeidiSQL VersiÃ³n:             9.4.0.5125
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Volcando estructura de base de datos para mydb
DROP DATABASE IF EXISTS `mydb`;
CREATE DATABASE IF NOT EXISTS `mydb` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `mydb`;

-- Volcando estructura para tabla mydb.brands
DROP TABLE IF EXISTS `brands`;
CREATE TABLE IF NOT EXISTS `brands` (
  `idbrand` int(11) NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `description` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`idbrand`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Volcando datos para la tabla mydb.brands: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `brands` DISABLE KEYS */;
/*!40000 ALTER TABLE `brands` ENABLE KEYS */;

-- Volcando estructura para tabla mydb.cars
DROP TABLE IF EXISTS `cars`;
CREATE TABLE IF NOT EXISTS `cars` (
  `idcar` int(11) NOT NULL,
  `idbrand` int(11) DEFAULT NULL,
  `model` varchar(45) DEFAULT NULL,
  `licence` varchar(45) DEFAULT NULL,
  `idcustomer` int(11) DEFAULT NULL,
  PRIMARY KEY (`idcar`),
  KEY `fk_car_brand_idx` (`idbrand`),
  KEY `fk_car_customer_idx` (`idcustomer`),
  CONSTRAINT `fk_car_brand` FOREIGN KEY (`idbrand`) REFERENCES `brands` (`idbrand`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_car_customer` FOREIGN KEY (`idcustomer`) REFERENCES `customers` (`idcustomer`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Volcando datos para la tabla mydb.cars: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `cars` DISABLE KEYS */;
/*!40000 ALTER TABLE `cars` ENABLE KEYS */;

-- Volcando estructura para tabla mydb.categories
DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `idcategory` int(11) NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `description` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`idcategory`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Volcando datos para la tabla mydb.categories: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;

-- Volcando estructura para tabla mydb.comments
DROP TABLE IF EXISTS `comments`;
CREATE TABLE IF NOT EXISTS `comments` (
  `idcomment` int(11) NOT NULL,
  `title` varchar(45) DEFAULT NULL,
  `comment` varchar(250) DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `idprovider` int(11) DEFAULT NULL,
  `idcustomer` int(11) DEFAULT NULL,
  PRIMARY KEY (`idcomment`),
  KEY `fk_comment_customer_idx` (`idcustomer`),
  KEY `fk_comment_provider_idx` (`idprovider`),
  CONSTRAINT `fk_comment_customer` FOREIGN KEY (`idcustomer`) REFERENCES `customers` (`idcustomer`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_comment_provider` FOREIGN KEY (`idprovider`) REFERENCES `providers` (`idprovider`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Volcando datos para la tabla mydb.comments: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;

-- Volcando estructura para tabla mydb.customers
DROP TABLE IF EXISTS `customers`;
CREATE TABLE IF NOT EXISTS `customers` (
  `idcustomer` int(11) NOT NULL,
  `dni` varchar(45) DEFAULT NULL,
  `name` varchar(45) DEFAULT NULL,
  `addess` varchar(200) DEFAULT NULL,
  `district` varchar(45) DEFAULT NULL,
  `phone` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idcustomer`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Volcando datos para la tabla mydb.customers: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;

-- Volcando estructura para tabla mydb.districts
DROP TABLE IF EXISTS `districts`;
CREATE TABLE IF NOT EXISTS `districts` (
  `iddistrict` int(11) NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`iddistrict`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Volcando datos para la tabla mydb.districts: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `districts` DISABLE KEYS */;
/*!40000 ALTER TABLE `districts` ENABLE KEYS */;

-- Volcando estructura para tabla mydb.favorites
DROP TABLE IF EXISTS `favorites`;
CREATE TABLE IF NOT EXISTS `favorites` (
  `idfavorite` int(11) NOT NULL,
  `idprovider` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `idcustomer` int(11) DEFAULT NULL,
  PRIMARY KEY (`idfavorite`),
  KEY `fk_favorite_provider_idx` (`idprovider`),
  KEY `fk_favorite_customer_idx` (`idcustomer`),
  CONSTRAINT `fk_favorite_customer` FOREIGN KEY (`idcustomer`) REFERENCES `customers` (`idcustomer`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_favorite_provider` FOREIGN KEY (`idprovider`) REFERENCES `providers` (`idprovider`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Volcando datos para la tabla mydb.favorites: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;

-- Volcando estructura para tabla mydb.providers
DROP TABLE IF EXISTS `providers`;
CREATE TABLE IF NOT EXISTS `providers` (
  `idprovider` int(11) NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `address` varchar(200) DEFAULT NULL,
  `iddistrict` int(11) DEFAULT NULL,
  `contact` varchar(45) DEFAULT NULL,
  `phone` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `web` varchar(45) DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  `schedule` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idprovider`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Volcando datos para la tabla mydb.providers: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `providers` DISABLE KEYS */;
/*!40000 ALTER TABLE `providers` ENABLE KEYS */;

-- Volcando estructura para tabla mydb.providerservices
DROP TABLE IF EXISTS `providerservices`;
CREATE TABLE IF NOT EXISTS `providerservices` (
  `idproviderservice` int(11) NOT NULL,
  `idservice` int(11) DEFAULT NULL,
  `idprovider` int(11) DEFAULT NULL,
  `price` double DEFAULT NULL,
  PRIMARY KEY (`idproviderservice`),
  KEY `fk_ps_provider_idx` (`idprovider`),
  KEY `fk_ps_service_idx` (`idservice`),
  CONSTRAINT `fk_ps_provider` FOREIGN KEY (`idprovider`) REFERENCES `providers` (`idprovider`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_ps_service` FOREIGN KEY (`idservice`) REFERENCES `services` (`idservice`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Volcando datos para la tabla mydb.providerservices: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `providerservices` DISABLE KEYS */;
/*!40000 ALTER TABLE `providerservices` ENABLE KEYS */;

-- Volcando estructura para tabla mydb.requesthistory
DROP TABLE IF EXISTS `requesthistory`;
CREATE TABLE IF NOT EXISTS `requesthistory` (
  `idrequesthistory` int(11) NOT NULL,
  `date` datetime DEFAULT NULL,
  `idstate` char(1) DEFAULT NULL,
  `idproviderservice` int(11) DEFAULT NULL,
  `idirequest` int(11) DEFAULT NULL,
  PRIMARY KEY (`idrequesthistory`),
  KEY `fk_rh_ps_idx` (`idproviderservice`),
  KEY `fk_rh_state_idx` (`idstate`),
  KEY `fk_rh_request_idx` (`idirequest`),
  CONSTRAINT `fk_rh_ps` FOREIGN KEY (`idproviderservice`) REFERENCES `providerservices` (`idproviderservice`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_rh_request` FOREIGN KEY (`idirequest`) REFERENCES `requests` (`idrequest`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_rh_state` FOREIGN KEY (`idstate`) REFERENCES `states` (`idstate`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Volcando datos para la tabla mydb.requesthistory: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `requesthistory` DISABLE KEYS */;
/*!40000 ALTER TABLE `requesthistory` ENABLE KEYS */;

-- Volcando estructura para tabla mydb.requests
DROP TABLE IF EXISTS `requests`;
CREATE TABLE IF NOT EXISTS `requests` (
  `idrequest` int(11) NOT NULL,
  `date` datetime DEFAULT NULL,
  `idproviderservice` int(11) DEFAULT NULL,
  `idcar` int(11) DEFAULT NULL,
  `idstate` char(1) DEFAULT NULL,
  PRIMARY KEY (`idrequest`),
  KEY `fk_request_state_idx` (`idstate`),
  KEY `fk_request_car_idx` (`idcar`),
  CONSTRAINT `fk_request_car` FOREIGN KEY (`idcar`) REFERENCES `cars` (`idcar`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_request_state` FOREIGN KEY (`idstate`) REFERENCES `states` (`idstate`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Volcando datos para la tabla mydb.requests: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `requests` ENABLE KEYS */;

-- Volcando estructura para tabla mydb.services
DROP TABLE IF EXISTS `services`;
CREATE TABLE IF NOT EXISTS `services` (
  `idservice` int(11) NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `description` varchar(200) DEFAULT NULL,
  `idcatedory` int(11) DEFAULT NULL,
  PRIMARY KEY (`idservice`),
  KEY `fk_service_category_idx` (`idcatedory`),
  CONSTRAINT `fk_service_category` FOREIGN KEY (`idcatedory`) REFERENCES `categories` (`idcategory`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Volcando datos para la tabla mydb.services: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
/*!40000 ALTER TABLE `services` ENABLE KEYS */;

-- Volcando estructura para tabla mydb.states
DROP TABLE IF EXISTS `states`;
CREATE TABLE IF NOT EXISTS `states` (
  `idstate` char(1) NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `description` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`idstate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Volcando datos para la tabla mydb.states: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `states` DISABLE KEYS */;
/*!40000 ALTER TABLE `states` ENABLE KEYS */;

-- Volcando estructura para tabla mydb.typeusers
DROP TABLE IF EXISTS `typeusers`;
CREATE TABLE IF NOT EXISTS `typeusers` (
  `idtypeuser` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `description` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`idtypeuser`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- Volcando datos para la tabla mydb.typeusers: ~2 rows (aproximadamente)
/*!40000 ALTER TABLE `typeusers` DISABLE KEYS */;
INSERT INTO `typeusers` (`idtypeuser`, `name`, `description`) VALUES
	(1, 'CLIENTE', 'USUARIO QUE TIENE ALGUNA EMERGENCIA'),
	(2, 'PROVEEDOR', 'USUARIO QUE ATIENDE UNA EMERGENCIA');
/*!40000 ALTER TABLE `typeusers` ENABLE KEYS */;

-- Volcando estructura para tabla mydb.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `iduser` int(11) NOT NULL AUTO_INCREMENT,
  `user` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `idtypeuser` int(11) DEFAULT NULL,
  PRIMARY KEY (`iduser`),
  KEY `FK_users_typeusers` (`idtypeuser`),
  CONSTRAINT `FK_users_typeusers` FOREIGN KEY (`idtypeuser`) REFERENCES `typeusers` (`idtypeuser`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- Volcando datos para la tabla mydb.users: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`iduser`, `user`, `password`, `idtypeuser`) VALUES
	(1, 'cajami', '123456', 1),
	(2, 'carlosh', 'abc123', 2);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
