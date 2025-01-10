-- Create the database
CREATE DATABASE IF NOT EXISTS mentories;

-- Use the database
USE mentories;

-- Create the tables

-- Table 1: qualifications
CREATE TABLE IF NOT EXISTS qualifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Table 2: classes
CREATE TABLE IF NOT EXISTS classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Table 3: typesUsers
CREATE TABLE IF NOT EXISTS typesUsers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Table 4: typesPublications
CREATE TABLE IF NOT EXISTS typesPublications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Table 5: users (initial creation without foreign key reference to classes)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    typesUsers_id INT DEFAULT 1,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    banner VARCHAR(255),
    profile VARCHAR(255),
    city VARCHAR(255),
    tags JSON DEFAULT NULL,
    discord_link VARCHAR(255),
    github_link VARCHAR(255),    
    availibility JSON DEFAULT NULL,
    verified BOOLEAN DEFAULT 0,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    review DECIMAL(2,1) DEFAULT 0,
    class_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (typesUsers_id) REFERENCES typesUsers(id),
    FOREIGN KEY (class_id) REFERENCES classes(id)
);

-- Table 6: teachersClasses (depends on users and classes)
CREATE TABLE IF NOT EXISTS teachersClasses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    class_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (class_id) REFERENCES classes(id)
);

-- Table 7: usersQualifications (depends on users and qualifications)
CREATE TABLE IF NOT EXISTS usersQualifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    qualification_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (qualification_id) REFERENCES qualifications(id)
);

-- Table 8: reviews (depends on users)
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reviewed_user_id INT NOT NULL,
    reviewer_user_id INT NOT NULL,
    rating DECIMAL(2,1) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reviewed_user_id) REFERENCES users(id),
    FOREIGN KEY (reviewer_user_id) REFERENCES users(id)
);

-- Table 9: publications (depends on users and typesPublications)
CREATE TABLE IF NOT EXISTS publications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    typesPublications_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    user_id INT NOT NULL,
    reports INT DEFAULT 0,  
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expired_at DATE,
    FOREIGN KEY (typesPublications_id) REFERENCES typesPublications(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table 10: comments (depends on publications and users)
CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    publication_id INT NOT NULL,
    user_id INT NOT NULL,
    commentReply_id INT,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (publication_id) REFERENCES publications(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (commentReply_id) REFERENCES comments(id)
);

-- Table 11: reportsPublications (depends on publications and users)
CREATE TABLE IF NOT EXISTS reportsPublications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    publication_id INT NOT NULL,
    user_id INT NOT NULL,
    report TEXT NOT NULL,
    status ENUM('pending', 'revising', 'revised') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (publication_id) REFERENCES publications(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table 12: reportsComments (depends on comments and users)
CREATE TABLE IF NOT EXISTS reportsComments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    comment_id INT NOT NULL,
    user_id INT NOT NULL,
    report TEXT NOT NULL,
    status ENUM('pending', 'revising', 'revised') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (comment_id) REFERENCES comments(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table 13: reportsUsers (depends on users)
CREATE TABLE IF NOT EXISTS reportsUsers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reported_user_id INT NOT NULL,
    user_id INT NOT NULL,
    report TEXT NOT NULL,
    status ENUM('pending', 'revising', 'revised') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reported_user_id) REFERENCES users(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table 14: newDataUsers (depends on users, typesUsers and classes)
CREATE TABLE IF NOT EXISTS newDataUsers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    typesUsers_id INT NOT NULL DEFAULT 1,
    user_id INT NOT NULL,
    name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    token VARCHAR(255),
    banner VARCHAR(255),
    profile VARCHAR(255),
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    class_id INT,
    FOREIGN KEY (typesUsers_id) REFERENCES typesUsers(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (class_id) REFERENCES classes(id)
);