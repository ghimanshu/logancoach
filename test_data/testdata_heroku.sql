-- phpMyAdmin SQL Dump
-- version 4.5.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Apr 20, 2016 at 04:29 AM
-- Server version: 10.1.10-MariaDB
-- PHP Version: 5.5.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";
SET FOREIGN_KEY_CHECKS=0;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `heroku_baf1eb8d5a744b9`
--
-- DROP DATABASE IF EXISTS `logancoachtestdata`;
-- CREATE DATABASE IF NOT EXISTS `logancoachtestdata` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
-- USE `logancoachtestdata`;

-- --------------------------------------------------------
DROP TABLE IF EXISTS `category`;
DROP TABLE IF EXISTS `dealerestimate`;
DROP TABLE IF EXISTS `dealerinfo`;
DROP TABLE IF EXISTS `estimates`;
DROP TABLE IF EXISTS `excludeitem`;
DROP TABLE IF EXISTS `item`;
DROP TABLE IF EXISTS `itemcost`;
DROP TABLE IF EXISTS `my_customer_table`;
DROP TABLE IF EXISTS `orderitems`;
DROP TABLE IF EXISTS `orderrequests`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `quickbooks_config`;
DROP TABLE IF EXISTS `quickbooks_log`;
DROP TABLE IF EXISTS `quickbooks_oauth`;
DROP TABLE IF EXISTS `quickbooks_queue`;
DROP TABLE IF EXISTS `quickbooks_recur`;
DROP TABLE IF EXISTS `quickbooks_ticket`;
DROP TABLE IF EXISTS `quickbooks_user`;
DROP TABLE IF EXISTS `specialrequests`;
DROP TABLE IF EXISTS `supercategory`;
DROP TABLE IF EXISTS `trailer`;
DROP TABLE IF EXISTS `trailercategoryoptions`;
DROP TABLE IF EXISTS `users`;


--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `categoryId` int(11) NOT NULL,
  `superCategoryId` int(11) NOT NULL,
  `categoryName` varchar(255) NOT NULL,
  `categoryDescription` text,
  `isMultiSelect` varchar(5) NOT NULL,
  `rank` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`categoryId`, `superCategoryId`, `categoryName`, `categoryDescription`, `isMultiSelect`, `rank`) VALUES
(1, 1, 'Hitch', '', 'false', NULL),
(2, 1, 'Tires', '', 'false', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `dealerestimate`
--

CREATE TABLE `dealerestimate` (
  `estimateId` int(11) NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `dealerId` int(11) NOT NULL,
  `trailerId` int(11) NOT NULL,
  `description` text,
  `valid` varchar(5) NOT NULL DEFAULT 'false',
  `specialRequests` longtext,
  `configuredCost` decimal(10,0) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `dealerestimate`
--

INSERT INTO `dealerestimate` (`estimateId`, `name`, `dealerId`, `trailerId`, `description`, `valid`, `specialRequests`, `configuredCost`) VALUES
(1, '1', 1443, 1, 'John Smith', 'true', NULL, '1050');

-- --------------------------------------------------------

--
-- Table structure for table `dealerinfo`
--

CREATE TABLE `dealerinfo` (
  `id` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  `address1` varchar(45) DEFAULT NULL,
  `address2` varchar(45) DEFAULT NULL,
  `address3` varchar(45) DEFAULT NULL,
  `address4` varchar(45) DEFAULT NULL,
  `address5` varchar(45) DEFAULT NULL,
  `phone` varchar(45) DEFAULT NULL,
  `otherInfo` text,
  `quickbooksId` varchar(45) DEFAULT NULL,
  `quickbooksEditSequence` varchar(45) DEFAULT NULL,
  `active` varchar(5) NOT NULL DEFAULT 'true'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `dealerinfo`
--

INSERT INTO `dealerinfo` (`id`, `name`, `address1`, `address2`, `address3`, `address4`, `address5`, `phone`, `otherInfo`, `quickbooksId`, `quickbooksEditSequence`, `active`) VALUES
(611, 'ADMINISTRATOR', 'na', 'na', 'na', 'na', 'na', 'na', 'na', 'na', 'na', 'na'),
(1443, 'DEALER', 'na', 'na', 'na', 'na', 'na', 'na', 'na', 'na2', 'na2', 'na2');

-- --------------------------------------------------------

--
-- Table structure for table `estimates`
--

CREATE TABLE `estimates` (
  `trailerId` int(11) NOT NULL,
  `itemId` int(11) NOT NULL,
  `estimateId` int(11) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `estimates`
--

INSERT INTO `estimates` (`trailerId`, `itemId`, `estimateId`, `quantity`) VALUES
(1, 1, 1, 0),
(1, 4, 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `excludeitem`
--

CREATE TABLE `excludeitem` (
  `trailerId` int(11) NOT NULL DEFAULT '0',
  `itemId` int(11) NOT NULL,
  `excluded` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `item`
--

CREATE TABLE `item` (
  `itemId` int(11) NOT NULL,
  `categoryId` int(11) NOT NULL,
  `itemDescription` text NOT NULL,
  `itemName` varchar(255) NOT NULL,
  `defaultPrice` double DEFAULT NULL,
  `rank` int(11) DEFAULT NULL,
  `lengthAdded` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `item`
--

INSERT INTO `item` (`itemId`, `categoryId`, `itemDescription`, `itemName`, `defaultPrice`, `rank`, `lengthAdded`) VALUES
(1, 1, '', 'Bumper', 0, 0, NULL),
(2, 1, '', '5th Wheel', 100, 1, NULL),
(3, 2, '', 'Small', 0, 0, NULL),
(4, 2, '', 'medium', 50, 1, NULL),
(5, 2, '', 'Large', 100, 2, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `itemcost`
--

CREATE TABLE `itemcost` (
  `trailerId` int(11) NOT NULL,
  `itemId` int(11) NOT NULL,
  `itemCost` double DEFAULT NULL,
  `standard` varchar(5) NOT NULL DEFAULT 'false',
  `maxQuantity` int(11) DEFAULT '1',
  `standardQuantity` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `itemcost`
--

INSERT INTO `itemcost` (`trailerId`, `itemId`, `itemCost`, `standard`, `maxQuantity`, `standardQuantity`) VALUES
(1, 1, NULL, 'true', 1, -1),
(1, 4, NULL, 'true', 1, -1);

-- --------------------------------------------------------

--
-- Table structure for table `my_customer_table`
--

CREATE TABLE `my_customer_table` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(64) NOT NULL,
  `fname` varchar(64) NOT NULL,
  `lname` varchar(64) NOT NULL,
  `quickbooks_listid` varchar(255) DEFAULT NULL,
  `quickbooks_editsequence` varchar(255) DEFAULT NULL,
  `quickbooks_errnum` varchar(255) DEFAULT NULL,
  `quickbooks_errmsg` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `orderitems`
--

CREATE TABLE `orderitems` (
  `orderId` int(11) NOT NULL,
  `itemId` int(11) NOT NULL,
  `itemName` varchar(45) DEFAULT NULL,
  `itemCost` double DEFAULT NULL,
  `itemDescription` text,
  `categoryName` varchar(45) DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `orderrequests`
--

CREATE TABLE `orderrequests` (
  `requestId` int(11) NOT NULL,
  `orderId` int(11) NOT NULL,
  `description` text,
  `cost` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `orderId` int(11) NOT NULL,
  `dealerId` int(11) NOT NULL,
  `trailerId` int(11) NOT NULL,
  `submitted` varchar(5) NOT NULL DEFAULT 'false',
  `trailerName` varchar(45) NOT NULL,
  `trailerDescription` text NOT NULL,
  `trailerCost` double DEFAULT NULL,
  `SalesmanFirst` varchar(45) DEFAULT NULL,
  `SalesmanLast` varchar(45) DEFAULT NULL,
  `timeStamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `quickbooks_listid` varchar(45) DEFAULT NULL,
  `quickbooks_editsequence` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `quickbooks_config`
--

CREATE TABLE `quickbooks_config` (
  `quickbooks_config_id` int(10) UNSIGNED NOT NULL,
  `qb_username` varchar(40) NOT NULL,
  `module` varchar(40) NOT NULL,
  `cfgkey` varchar(40) NOT NULL,
  `cfgval` varchar(40) NOT NULL,
  `cfgtype` varchar(40) NOT NULL,
  `cfgopts` text NOT NULL,
  `write_datetime` datetime NOT NULL,
  `mod_datetime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `quickbooks_log`
--

CREATE TABLE `quickbooks_log` (
  `quickbooks_log_id` int(10) UNSIGNED NOT NULL,
  `quickbooks_ticket_id` int(10) UNSIGNED DEFAULT NULL,
  `batch` int(10) UNSIGNED NOT NULL,
  `msg` text NOT NULL,
  `log_datetime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `quickbooks_oauth`
--

CREATE TABLE `quickbooks_oauth` (
  `quickbooks_oauth_id` int(10) UNSIGNED NOT NULL,
  `app_username` varchar(255) NOT NULL,
  `app_tenant` varchar(255) NOT NULL,
  `oauth_request_token` varchar(255) DEFAULT NULL,
  `oauth_request_token_secret` varchar(255) DEFAULT NULL,
  `oauth_access_token` varchar(255) DEFAULT NULL,
  `oauth_access_token_secret` varchar(255) DEFAULT NULL,
  `qb_realm` varchar(32) DEFAULT NULL,
  `qb_flavor` varchar(12) DEFAULT NULL,
  `qb_user` varchar(64) DEFAULT NULL,
  `request_datetime` datetime NOT NULL,
  `access_datetime` datetime DEFAULT NULL,
  `touch_datetime` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `quickbooks_queue`
--

CREATE TABLE `quickbooks_queue` (
  `quickbooks_queue_id` int(10) UNSIGNED NOT NULL,
  `quickbooks_ticket_id` int(10) UNSIGNED DEFAULT NULL,
  `qb_username` varchar(40) NOT NULL,
  `qb_action` varchar(32) NOT NULL,
  `ident` varchar(40) NOT NULL,
  `extra` text,
  `qbxml` text,
  `priority` int(10) UNSIGNED DEFAULT '0',
  `qb_status` char(1) NOT NULL,
  `msg` text,
  `enqueue_datetime` datetime NOT NULL,
  `dequeue_datetime` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `quickbooks_recur`
--

CREATE TABLE `quickbooks_recur` (
  `quickbooks_recur_id` int(10) UNSIGNED NOT NULL,
  `qb_username` varchar(40) NOT NULL,
  `qb_action` varchar(32) NOT NULL,
  `ident` varchar(40) NOT NULL,
  `extra` text,
  `qbxml` text,
  `priority` int(10) UNSIGNED DEFAULT '0',
  `run_every` int(10) UNSIGNED NOT NULL,
  `recur_lasttime` int(10) UNSIGNED NOT NULL,
  `enqueue_datetime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `quickbooks_ticket`
--

CREATE TABLE `quickbooks_ticket` (
  `quickbooks_ticket_id` int(10) UNSIGNED NOT NULL,
  `qb_username` varchar(40) NOT NULL,
  `ticket` char(36) NOT NULL,
  `processed` int(10) UNSIGNED DEFAULT '0',
  `lasterror_num` varchar(32) DEFAULT NULL,
  `lasterror_msg` varchar(255) DEFAULT NULL,
  `ipaddr` char(15) NOT NULL,
  `write_datetime` datetime NOT NULL,
  `touch_datetime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `quickbooks_user`
--

CREATE TABLE `quickbooks_user` (
  `qb_username` varchar(40) NOT NULL,
  `qb_password` varchar(255) NOT NULL,
  `qb_company_file` varchar(255) DEFAULT NULL,
  `qbwc_wait_before_next_update` int(10) UNSIGNED DEFAULT '0',
  `qbwc_min_run_every_n_seconds` int(10) UNSIGNED DEFAULT '0',
  `status` char(1) NOT NULL,
  `write_datetime` datetime NOT NULL,
  `touch_datetime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `specialrequests`
--

CREATE TABLE `specialrequests` (
  `id` int(11) NOT NULL,
  `description` text NOT NULL,
  `cost` float DEFAULT '0',
  `estimateId` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `supercategory`
--

CREATE TABLE `supercategory` (
  `superId` int(11) NOT NULL,
  `superName` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `supercategory`
--

INSERT INTO `supercategory` (`superId`, `superName`) VALUES
(1, ''),
(2, ''),
(3, ''),
(4, ''),
(5, ''),
(6, ''),
(7, '');

-- --------------------------------------------------------

--
-- Table structure for table `trailer`
--

CREATE TABLE `trailer` (
  `trailerId` int(11) NOT NULL,
  `trailerName` varchar(45) DEFAULT NULL,
  `trailerDescription` text,
  `trailerCost` double NOT NULL,
  `trailerUrl` varchar(500) DEFAULT NULL,
  `isPublic` varchar(5) DEFAULT 'false',
  `rank` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `trailer`
--

INSERT INTO `trailer` (`trailerId`, `trailerName`, `trailerDescription`, `trailerCost`, `trailerUrl`, `isPublic`, `rank`) VALUES
(1, 'Simple', 'A simple trailer for testing', 1000, NULL, 'true', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `trailercategoryoptions`
--

CREATE TABLE `trailercategoryoptions` (
  `trailerId` int(11) NOT NULL,
  `categoryId` int(11) NOT NULL,
  `minQuantity` int(11) DEFAULT '0',
  `maxQuantity` int(11) DEFAULT '0',
  `isMultiSelect` char(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `dealerId` int(11) NOT NULL,
  `username` varchar(45) DEFAULT NULL,
  `password` varchar(90) DEFAULT NULL,
  `admin` varchar(5) DEFAULT 'false',
  `email` varchar(300) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `dealerId`, `username`, `password`, `admin`, `email`) VALUES
(71, 611, 'admin', '$2a$10$F6AyLy6mJMxMfeFCnd1q9eTv3fFEpvu.XuLEWVMW0AseSQ4yVTN.e', 'true', 'asdf@asdf.com'),
(141, 611, 'user', '$2a$10$.YgRW9ye0gDqJmhKxt.sKuyDNJLuEms3ATAGb9ZxnhFGxSgMG7xde', 'false', 'asdf@asdf.com'),
(743, 1443, 'dealer', '$2a$10$JVJOk8sSDO8i4qfZ0SIELOAgB8NRhQCRTKVZuPOLH8S6OvBJ7A.7K', 'false', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`categoryId`,`superCategoryId`),
  ADD KEY `fk_subCategory_Category1_idx` (`superCategoryId`);

--
-- Indexes for table `dealerestimate`
--
ALTER TABLE `dealerestimate`
  ADD PRIMARY KEY (`estimateId`,`dealerId`,`trailerId`),
  ADD KEY `fk_dealerEstimate_dealerInfo1_idx` (`dealerId`),
  ADD KEY `fk_dealerEstimate_trailer1_idx` (`trailerId`);

--
-- Indexes for table `dealerinfo`
--
ALTER TABLE `dealerinfo`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name_UNIQUE` (`name`),
  ADD UNIQUE KEY `quickbooksId_UNIQUE` (`quickbooksId`);

--
-- Indexes for table `estimates`
--
ALTER TABLE `estimates`
  ADD PRIMARY KEY (`trailerId`,`itemId`,`estimateId`),
  ADD KEY `fk_Estimates_itemCost1_idx` (`trailerId`,`itemId`),
  ADD KEY `fk_Estimates_dealerEstimate1_idx` (`estimateId`);

--
-- Indexes for table `excludeitem`
--
ALTER TABLE `excludeitem`
  ADD PRIMARY KEY (`itemId`,`excluded`,`trailerId`),
  ADD KEY `FK_EXCLUDED_ITEMS_idx` (`excluded`);

--
-- Indexes for table `item`
--
ALTER TABLE `item`
  ADD PRIMARY KEY (`itemId`,`categoryId`),
  ADD KEY `fk_item_Category1_idx` (`categoryId`);

--
-- Indexes for table `itemcost`
--
ALTER TABLE `itemcost`
  ADD PRIMARY KEY (`trailerId`,`itemId`),
  ADD KEY `fk_Trailor_has_item_item1_idx` (`itemId`),
  ADD KEY `fk_Trailor_has_item_Trailor1_idx` (`trailerId`);

--
-- Indexes for table `my_customer_table`
--
ALTER TABLE `my_customer_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orderitems`
--
ALTER TABLE `orderitems`
  ADD PRIMARY KEY (`orderId`,`itemId`);

--
-- Indexes for table `orderrequests`
--
ALTER TABLE `orderrequests`
  ADD PRIMARY KEY (`requestId`,`orderId`),
  ADD KEY `fk_table1_orders_idx` (`orderId`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`orderId`),
  ADD KEY `fk_Orders_dealerInfo1_idx` (`dealerId`);

--
-- Indexes for table `quickbooks_config`
--
ALTER TABLE `quickbooks_config`
  ADD PRIMARY KEY (`quickbooks_config_id`);

--
-- Indexes for table `quickbooks_log`
--
ALTER TABLE `quickbooks_log`
  ADD PRIMARY KEY (`quickbooks_log_id`),
  ADD KEY `quickbooks_ticket_id` (`quickbooks_ticket_id`),
  ADD KEY `batch` (`batch`);

--
-- Indexes for table `quickbooks_oauth`
--
ALTER TABLE `quickbooks_oauth`
  ADD PRIMARY KEY (`quickbooks_oauth_id`);

--
-- Indexes for table `quickbooks_queue`
--
ALTER TABLE `quickbooks_queue`
  ADD PRIMARY KEY (`quickbooks_queue_id`),
  ADD KEY `quickbooks_ticket_id` (`quickbooks_ticket_id`),
  ADD KEY `priority` (`priority`),
  ADD KEY `qb_username` (`qb_username`,`qb_action`,`ident`,`qb_status`),
  ADD KEY `qb_status` (`qb_status`);

--
-- Indexes for table `quickbooks_recur`
--
ALTER TABLE `quickbooks_recur`
  ADD PRIMARY KEY (`quickbooks_recur_id`),
  ADD KEY `qb_username` (`qb_username`,`qb_action`,`ident`),
  ADD KEY `priority` (`priority`);

--
-- Indexes for table `quickbooks_ticket`
--
ALTER TABLE `quickbooks_ticket`
  ADD PRIMARY KEY (`quickbooks_ticket_id`),
  ADD KEY `ticket` (`ticket`);

--
-- Indexes for table `quickbooks_user`
--
ALTER TABLE `quickbooks_user`
  ADD PRIMARY KEY (`qb_username`);

--
-- Indexes for table `specialrequests`
--
ALTER TABLE `specialrequests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_specialRequests_dealerEstimate1_idx` (`estimateId`);

--
-- Indexes for table `supercategory`
--
ALTER TABLE `supercategory`
  ADD PRIMARY KEY (`superId`);

--
-- Indexes for table `trailer`
--
ALTER TABLE `trailer`
  ADD PRIMARY KEY (`trailerId`),
  ADD UNIQUE KEY `name_UNIQUE` (`trailerName`);

--
-- Indexes for table `trailercategoryoptions`
--
ALTER TABLE `trailercategoryoptions`
  ADD PRIMARY KEY (`trailerId`,`categoryId`),
  ADD KEY `trailercategoryoptions_CATEGORY_FK_idx` (`categoryId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`,`dealerId`),
  ADD KEY `fk_users_dealerInfo1_idx` (`dealerId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `categoryId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `dealerestimate`
--
ALTER TABLE `dealerestimate`
  MODIFY `estimateId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `dealerinfo`
--
ALTER TABLE `dealerinfo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1444;
--
-- AUTO_INCREMENT for table `item`
--
ALTER TABLE `item`
  MODIFY `itemId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `my_customer_table`
--
ALTER TABLE `my_customer_table`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT for table `orderitems`
--
ALTER TABLE `orderitems`
  MODIFY `orderId` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `orderrequests`
--
ALTER TABLE `orderrequests`
  MODIFY `requestId` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `orderId` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `quickbooks_config`
--
ALTER TABLE `quickbooks_config`
  MODIFY `quickbooks_config_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `quickbooks_log`
--
ALTER TABLE `quickbooks_log`
  MODIFY `quickbooks_log_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `quickbooks_oauth`
--
ALTER TABLE `quickbooks_oauth`
  MODIFY `quickbooks_oauth_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `quickbooks_queue`
--
ALTER TABLE `quickbooks_queue`
  MODIFY `quickbooks_queue_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `quickbooks_recur`
--
ALTER TABLE `quickbooks_recur`
  MODIFY `quickbooks_recur_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `quickbooks_ticket`
--
ALTER TABLE `quickbooks_ticket`
  MODIFY `quickbooks_ticket_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `specialrequests`
--
ALTER TABLE `specialrequests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `trailer`
--
ALTER TABLE `trailer`
  MODIFY `trailerId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=744;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `category`
--
ALTER TABLE `category`
  ADD CONSTRAINT `fk_subCategory_Category1` FOREIGN KEY (`superCategoryId`) REFERENCES `supercategory` (`superId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `dealerestimate`
--
ALTER TABLE `dealerestimate`
  ADD CONSTRAINT `fk_dealerEstimate_dealerInfo1` FOREIGN KEY (`dealerId`) REFERENCES `dealerinfo` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_dealerEstimate_trailer1` FOREIGN KEY (`trailerId`) REFERENCES `trailer` (`trailerId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `estimates`
--
ALTER TABLE `estimates`
  ADD CONSTRAINT `fk_Estimates_dealerEstimate1` FOREIGN KEY (`estimateId`) REFERENCES `dealerestimate` (`estimateId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Estimates_itemCost1` FOREIGN KEY (`trailerId`,`itemId`) REFERENCES `itemcost` (`trailerId`, `itemId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `excludeitem`
--
ALTER TABLE `excludeitem`
  ADD CONSTRAINT `FK_EXCLUDED_ITEMS` FOREIGN KEY (`excluded`) REFERENCES `item` (`itemId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_EXCLUDED_ITEMS2` FOREIGN KEY (`itemId`) REFERENCES `item` (`itemId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `item`
--
ALTER TABLE `item`
  ADD CONSTRAINT `fk_item_Category1` FOREIGN KEY (`categoryId`) REFERENCES `category` (`categoryId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `itemcost`
--
ALTER TABLE `itemcost`
  ADD CONSTRAINT `fk_Trailor_has_item_Trailor1` FOREIGN KEY (`trailerId`) REFERENCES `trailer` (`trailerId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Trailor_has_item_item1` FOREIGN KEY (`itemId`) REFERENCES `item` (`itemId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `orderitems`
--
ALTER TABLE `orderitems`
  ADD CONSTRAINT `fk_orderItems_orders1` FOREIGN KEY (`orderId`) REFERENCES `orders` (`orderId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `orderrequests`
--
ALTER TABLE `orderrequests`
  ADD CONSTRAINT `fk_table1_orders` FOREIGN KEY (`orderId`) REFERENCES `orders` (`orderId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_Orders_dealerInfo1` FOREIGN KEY (`dealerId`) REFERENCES `dealerinfo` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `specialrequests`
--
ALTER TABLE `specialrequests`
  ADD CONSTRAINT `fk_specialRequests_dealerEstimate1` FOREIGN KEY (`estimateId`) REFERENCES `dealerestimate` (`estimateId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `trailercategoryoptions`
--
ALTER TABLE `trailercategoryoptions`
  ADD CONSTRAINT `trailercategoryoptions_CATEGORY_FK` FOREIGN KEY (`categoryId`) REFERENCES `category` (`categoryId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `trailercategoryoptions_TRAILER_FK` FOREIGN KEY (`trailerId`) REFERENCES `trailer` (`trailerId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_users_dealerInfo1` FOREIGN KEY (`dealerId`) REFERENCES `dealerinfo` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
SET FOREIGN_KEY_CHECKS=1;

alter table dealerestimate add column status text;
