-- Create the database if she doesn't exist
CREATE DATABASE IF NOT EXISTS mydatabase;

-- Use this database
USE mydatabase;

-- Create the table `users`
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
);