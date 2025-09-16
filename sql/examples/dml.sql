

-- Admin
INSERT INTO administrator (user_name, password, email, full_name, role, status)
VALUES ('admin1', 'hash', 'admin1@lms.com', 'System Admin', 'superadmin', 'active');

-- Instructor
INSERT INTO instructor (user_name, password, email, full_name, bio, status)
VALUES ('teach1', 'pass1', 'teach1@lms.com', 'Dr. Smith', 'Math teacher', 'active');

-- Student
INSERT INTO student (user_name, password, email, phone_no, f_name, l_name, status)
VALUES ('stud1', 'pass2', 'stud1@lms.com', '1234567890', 'John', 'Doe', 'active');

-- Course
INSERT INTO course (instructor_id, title, description, category, language, price, status)
VALUES (1, 'Intro to DB', 'SQL Basics', 'Tech', 'English', 29.99, 'published');
