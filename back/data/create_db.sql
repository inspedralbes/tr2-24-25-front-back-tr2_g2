-- Create the database
CREATE DATABASE IF NOT EXISTS mentories;

-- Use the database
USE mentories;

-- Create the tables
CREATE TABLE IF NOT EXISTS qualifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS typesUsers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS typesPublications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    typesUsers_id INT NOT NULL DEFAULT 1,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255),
    token VARCHAR(255),
    verified BOOLEAN NOT NULL DEFAULT 0,
    review DECIMAL(2,1) DEFAULT 0,
    qualification_id INT NOT NULL,
    class_id INT,
    FOREIGN KEY (qualification_id) REFERENCES qualifications(id),
    FOREIGN KEY (class_id) REFERENCES classes(id)
);

CREATE TABLE IF NOT EXISTS publications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    typesPublications_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    user_id INT NOT NULL,
    reports INT DEFAULT 0,  
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expired_at TIMESTAMP DEFAULT,
    FOREIGN KEY (typesPublications_id) REFERENCES typesPublications(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
)