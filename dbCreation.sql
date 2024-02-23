-- MySQL Workbench Forward Engineering



-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema task_app_data
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema task_app_data
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `task_app_data` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `task_app_data` ;

-- -----------------------------------------------------
-- Table `task_app_data`.`admins`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `task_app_data`.`admins` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) NOT NULL,
  `surname` VARCHAR(191) NOT NULL,
  `password` VARCHAR(191) NOT NULL,
  `photo` VARCHAR(191) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `task_app_data`.`assigned_os`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `task_app_data`.`assigned_os` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `order_id` INT NOT NULL,
  `worker_name` VARCHAR(191) NOT NULL,
  `worker_id` INT NOT NULL,
  `worker_hours` DECIMAL(5,2) NOT NULL,
  `start_date` VARCHAR(45) NOT NULL,
  `end_date` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `task_app_data`.`service_orders`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `task_app_data`.`service_orders` (
  `id` INT NOT NULL,
  `status` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `costumer` VARCHAR(191) NOT NULL,
  `description` VARCHAR(191) NOT NULL,
  `start_date` DATETIME(3) NOT NULL,
  `end_date` DATETIME(3) NOT NULL,
  `workers_qnt` INT NOT NULL,
  `bu` VARCHAR(191) NOT NULL,
  `created_at` INT NOT NULL,
  `completed_at` INT NOT NULL,
  `annotation` VARCHAR(191) NOT NULL,
  `performed_hours` DECIMAL(5,2) NOT NULL,
  `planned_hours` DECIMAL(5,2) NOT NULL,
  `assigned_workers_id` JSON NOT NULL,
  `lms` JSON NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `task_app_data`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `task_app_data`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) NOT NULL,
  `surname` VARCHAR(191) NOT NULL,
  `role` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NULL DEFAULT NULL,
  `password` VARCHAR(191) NOT NULL,
  `photo` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

