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

-- Table 2: typesUsers
CREATE TABLE IF NOT EXISTS typesUsers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Table 3: typesPublications
CREATE TABLE IF NOT EXISTS typesPublications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Table 4: users (initial creation without foreign key reference to classes)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    typesUsers_id INT NOT NULL DEFAULT 1,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255),
    token VARCHAR(255),
    verified BOOLEAN NOT NULL DEFAULT 0,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    review DECIMAL(2,1) DEFAULT 0,
    class_id INT,
    FOREIGN KEY (typesUsers_id) REFERENCES typesUsers(id)
);

-- Table 5: classes
CREATE TABLE IF NOT EXISTS classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    teacher_user_id INT NOT NULL,
    FOREIGN KEY (teacher_user_id) REFERENCES users(id)
);

-- Modify Table 4: users to add foreign key reference to classes
ALTER TABLE users ADD CONSTRAINT FK_users_classes FOREIGN KEY (class_id) REFERENCES classes(id);

-- Table 6: usersQualifications (depends on users and qualifications)
CREATE TABLE IF NOT EXISTS usersQualifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    qualification_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (qualification_id) REFERENCES qualifications(id)
);

-- Table 7: reviews (depends on users)
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reviewed_user_id INT NOT NULL,
    reviewer_user_id INT NOT NULL,
    rating DECIMAL(2,1) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reviewed_user_id) REFERENCES users(id),
    FOREIGN KEY (reviewer_user_id) REFERENCES users(id)
);

-- Table 8: publications (depends on users and typesPublications)
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
);

-- Table 9: comments (depends on publications and users)
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

-- Table 10: reportsPublications (depends on publications and users)
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

-- Table 11: reportsComments (depends on comments and users)
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

-- Table 12: reportsUsers (depends on users)
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