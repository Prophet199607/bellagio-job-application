/*
SQLyog Enterprise v12.5.1 (64 bit)
MySQL - 10.4.32-MariaDB : Database - jobportal
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`jobportal` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `jobportal`;

/*Table structure for table `applied` */

DROP TABLE IF EXISTS `applied`;

CREATE TABLE `applied` (
  `id` char(36) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `age_range` varchar(20) DEFAULT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `total_experience` int(11) DEFAULT NULL,
  `expected_salary` decimal(12,2) DEFAULT NULL,
  `vacancy_id` int(11) DEFAULT NULL,
  `cv_file` varchar(255) NOT NULL,
  `educational_files` text NOT NULL,
  `professional_files` text DEFAULT NULL,
  `applied_date` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `vacancy_id` (`vacancy_id`),
  CONSTRAINT `applied_ibfk_1` FOREIGN KEY (`vacancy_id`) REFERENCES `vacancies` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `applied` */

insert  into `applied`(`id`,`first_name`,`last_name`,`email`,`phone`,`address`,`age_range`,`gender`,`total_experience`,`expected_salary`,`vacancy_id`,`cv_file`,`educational_files`,`professional_files`,`applied_date`) values 
('100e0855-8f82-43bd-8c68-75fa4566a7ba','23','23','23','23','23','18-24','Male',32,23.00,6,'/uploads/1770975489625-719698151-Screenshot-2026-02-05-094158.png','[\"/uploads/1770975489626-173767758-Screenshot-2026-02-05-094158.png\",\"/uploads/1770975489628-579270363-Screenshot-2026-02-05-095438.png\",\"/uploads/1770975489630-497250531-Screenshot-2026-02-05-111016.png\"]','[\"/uploads/1770975489631-315474359-Screenshot-2026-02-05-094158.png\",\"/uploads/1770975489633-652174775-Screenshot-2026-02-05-095438.png\",\"/uploads/1770975489635-866968891-Screenshot-2026-02-05-111016.png\"]','2026-02-13 15:08:09'),
('1de4fc4b-93dd-45ea-9f75-aa525614bc3f','Prasad','sandaruwan','prasadsandaruwan069@gmail.com','+94701251898','no/85/Bimpokunugama,Hambeganuwa,Thanamalwila','18-24','Male',3,120000.00,6,'/uploads/1772696612596-777722974-main.png','[\"/uploads/1772696612598-995742719-main.png\"]','[\"/uploads/1772696612601-511749831-main.png\"]','2026-03-05 13:13:32'),
('a1e8c0f9-4fb5-4666-ba97-81237849d43e','prasad','sandatruwan','prasadsandaruwan069@gmail.com','+94701251898','no/85/Bimpokunugama,','','',2,20000.00,6,'/uploads/1772701235123-662496051-main.png','[\"/uploads/1772701235125-160509170-main.png\"]','[\"/uploads/1772701235130-309493042-main.png\"]','2026-03-05 14:30:35'),
('dc06028a-222e-4cef-938c-063315952297','madushanka','samnarasinhe','madushanka@gmail.com','0711251898','art cafe.LK PVT Ltd, No 192/71/A, Mahiyangana Road, Badulla, Sri Lanka.','18-24','Male',1,14998.00,6,'/uploads/1770973658628-466202118-5_6122885770651900366.pdf','[\"/uploads/1770973658630-796747020-side_detection.png\",\"/uploads/1770973658634-597984928-hidden_detection.png\"]','[\"/uploads/1770973658637-109683550-M-2023---Statistics-for-IT.pdf\"]','2026-02-13 14:37:38');

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `role` varchar(50) DEFAULT 'user',
  `username` varchar(50) DEFAULT 'user',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2038 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `users` */

insert  into `users`(`id`,`name`,`email`,`password`,`created_at`,`role`,`username`) values 
(2036,'admin2','admin@gmail.com','$2b$10$JyyhjOiRyGb9oo1trdMqUeCed1mxXxs29MndKLEpQB4UYruHSvIui','2026-03-05 13:23:02','admin','admin2'),
(2037,NULL,NULL,NULL,'2026-03-05 13:36:06','admin','user');

/*Table structure for table `vacancies` */

DROP TABLE IF EXISTS `vacancies`;

CREATE TABLE `vacancies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `location` varchar(150) DEFAULT NULL,
  `salary_range` varchar(100) DEFAULT NULL,
  `status` enum('Available','Not Available') DEFAULT 'Available',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `vacancies` */

insert  into `vacancies`(`id`,`title`,`description`,`location`,`salary_range`,`status`,`created_at`) values 
(5,'DevOps Engineer',NULL,NULL,NULL,'Available','2026-02-12 10:15:17'),
(6,'senio software engineer',NULL,NULL,NULL,'Available','2026-02-12 11:16:12');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
