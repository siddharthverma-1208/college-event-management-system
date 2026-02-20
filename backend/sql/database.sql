-- =====================================================
-- College Event Management System - Database Setup
-- =====================================================
-- Run this script in phpMyAdmin or MySQL command line
-- to create the database and tables
-- =====================================================

-- Create Database
CREATE DATABASE IF NOT EXISTS college_events;
USE college_events;

-- =====================================================
-- EVENTS TABLE
-- Stores all college events
-- =====================================================
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    venue VARCHAR(255) NOT NULL,
    description TEXT,
    max_capacity INT DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_date (date),
    INDEX idx_event_name (event_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- USERS (STUDENTS) TABLE
-- Stores registered students for events
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    college_name VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    gender ENUM('male', 'female', 'other') NOT NULL,
    university_roll_number VARCHAR(50) NOT NULL,
    batch VARCHAR(20) NOT NULL,
    event_id INT NOT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key relationship
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    
    -- Prevent duplicate registrations
    UNIQUE KEY unique_email_event (email, event_id),
    UNIQUE KEY unique_roll_event (university_roll_number, event_id),
    
    INDEX idx_event_id (event_id),
    INDEX idx_email (email),
    INDEX idx_roll_number (university_roll_number),
    INDEX idx_registered_at (registered_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- ADMIN TABLE
-- Stores admin credentials (password is hashed)
-- =====================================================
CREATE TABLE IF NOT EXISTS admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Hashed password
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- INSERT SAMPLE DATA
-- =====================================================

-- Insert default admin (password: admin123)
-- Password hash generated using password_hash('admin123', PASSWORD_DEFAULT)
INSERT INTO admin (username, password, email) VALUES 
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@college.edu')
ON DUPLICATE KEY UPDATE username = username;

-- Insert sample events
INSERT INTO events (event_name, date, venue, description, max_capacity) VALUES
('Tech Fest 2024', DATE_ADD(CURDATE(), INTERVAL 7 DAY), 'Main Auditorium', 'Annual technology festival with coding competitions, robotics showcase, and tech workshops by industry experts.', 500),
('Cultural Night', DATE_ADD(CURDATE(), INTERVAL 14 DAY), 'Open Air Theater', 'A magical night celebrating diversity through music, dance, drama, and cultural performances from around the world.', 1000),
('Sports Meet 2024', DATE_ADD(CURDATE(), INTERVAL 21 DAY), 'College Ground', 'Inter-college sports competition featuring athletics, team sports, and individual events with exciting prizes.', 300),
('Hackathon', DATE_ADD(CURDATE(), INTERVAL 30 DAY), 'Computer Lab Complex', '24-hour coding marathon to build innovative solutions. Team up and create something amazing!', 200),
('Career Fair 2024', DATE_ADD(CURDATE(), INTERVAL 45 DAY), 'Exhibition Hall', 'Connect with top companies, explore career opportunities, and attend resume building workshops.', 800),
('Music Festival', DATE_ADD(CURDATE(), INTERVAL 60 DAY), 'College Amphitheater', 'A day of live performances featuring student bands, solo artists, and guest musicians.', 1500)
ON DUPLICATE KEY UPDATE event_name = event_name;

-- Insert sample student registrations
INSERT INTO users (full_name, email, contact_number, college_name, age, gender, university_roll_number, batch, event_id) VALUES
('Rahul Sharma', 'rahul.sharma@email.com', '9876543210', 'Delhi University', 21, 'male', 'DU2021001', '2021-2025', 1),
('Priya Patel', 'priya.patel@email.com', '9876543211', 'Mumbai University', 20, 'female', 'MU2022001', '2022-2026', 1),
('Amit Kumar', 'amit.kumar@email.com', '9876543212', 'IIT Delhi', 22, 'male', 'IIT2021002', '2021-2025', 2),
('Sneha Reddy', 'sneha.reddy@email.com', '9876543213', 'BITS Pilani', 21, 'female', 'BITS2022003', '2022-2026', 1),
('Vikram Singh', 'vikram.singh@email.com', '9876543214', 'NIT Trichy', 23, 'male', 'NIT2020004', '2020-2024', 3)
ON DUPLICATE KEY UPDATE full_name = full_name;

-- =====================================================
-- USEFUL QUERIES FOR ADMIN
-- =====================================================

-- View all events with registration count
-- SELECT e.*, COUNT(u.id) as registration_count 
-- FROM events e 
-- LEFT JOIN users u ON e.id = u.event_id 
-- GROUP BY e.id;

-- View students with event details
-- SELECT u.*, e.event_name, e.date as event_date, e.venue 
-- FROM users u 
-- JOIN events e ON u.event_id = e.id;

-- Get registration count per event
-- SELECT e.event_name, COUNT(u.id) as registrations 
-- FROM events e 
-- LEFT JOIN users u ON e.id = u.event_id 
-- GROUP BY e.id;

-- =====================================================
-- END OF SETUP SCRIPT
-- =====================================================
