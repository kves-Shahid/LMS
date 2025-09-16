
CREATE TABLE student (
  student_id       INT AUTO_INCREMENT PRIMARY KEY,
  user_name        VARCHAR(50) NOT NULL UNIQUE,
  password         VARCHAR(255) NOT NULL,
  email            VARCHAR(100) NOT NULL UNIQUE,
  phone_no         VARCHAR(20),
  f_name           VARCHAR(50),
  l_name           VARCHAR(50),
  status           ENUM('active', 'inactive') DEFAULT 'active',
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE instructor (
  instructor_id    INT AUTO_INCREMENT PRIMARY KEY,
  user_name        VARCHAR(50) NOT NULL UNIQUE,
  password         VARCHAR(255) NOT NULL,
  email            VARCHAR(100) NOT NULL UNIQUE,
  full_name        VARCHAR(100),
  bio              TEXT,
  social_links     JSON,
  status           ENUM('active', 'inactive') DEFAULT 'active',
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE instructor_social_link (
  link_id          INT AUTO_INCREMENT PRIMARY KEY,
  instructor_id    INT NOT NULL,
  label            VARCHAR(50),
  url              VARCHAR(255)
);

CREATE TABLE administrator (
  admin_id         INT AUTO_INCREMENT PRIMARY KEY,
  user_name        VARCHAR(50) NOT NULL UNIQUE,
  password         VARCHAR(255) NOT NULL,
  email            VARCHAR(100) NOT NULL UNIQUE,
  full_name        VARCHAR(100),
  role             VARCHAR(50),
  status           ENUM('active', 'inactive') DEFAULT 'active',
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

select * from admin;

RENAME TABLE `administrator` TO `admin`;

CREATE TABLE course (
  course_id        INT AUTO_INCREMENT PRIMARY KEY,
  instructor_id    INT,
  title            VARCHAR(100) NOT NULL,
  description      TEXT,
  label            VARCHAR(50),
  price            DECIMAL(10,2),
  category         VARCHAR(50),
  language         VARCHAR(50),
  level            VARCHAR(50),
  status           ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

select * from course;

CREATE TABLE enrollment (
  enrollment_id    INT AUTO_INCREMENT PRIMARY KEY,
  student_id       INT NOT NULL,
  course_id        INT NOT NULL,
  enrolled_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status           ENUM('active', 'completed', 'dropped') DEFAULT 'active'
);

CREATE TABLE module (
  module_id        INT AUTO_INCREMENT PRIMARY KEY,
  course_id        INT NOT NULL,
  title            VARCHAR(100),
  description      TEXT,
  position         INT,
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lesson (
  lesson_id        INT AUTO_INCREMENT PRIMARY KEY,
  module_id        INT NOT NULL,
  title            VARCHAR(100),
  resource         TEXT,
  video_url        VARCHAR(255),
  position         INT,
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE quiz (
  quiz_id          INT AUTO_INCREMENT PRIMARY KEY,
  module_id        INT NOT NULL,
  title            VARCHAR(100),
  total_marks      INT NOT NULL,
  time_limit       INT,
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE quiz_attempt (
  attempt_id       INT AUTO_INCREMENT PRIMARY KEY,
  quiz_id          INT NOT NULL,
  student_id       INT NOT NULL,
  score            DECIMAL(5,2),
  attempted_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  attempt_no       INT
);

CREATE TABLE assignment (
  assignment_id    INT AUTO_INCREMENT PRIMARY KEY,
  module_id        INT NOT NULL,
  title            VARCHAR(100),
  description      TEXT,
  due_date         DATE,
  max_score        INT NOT NULL,
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE submission (
  submission_id    INT AUTO_INCREMENT PRIMARY KEY,
  assignment_id    INT NOT NULL,
  student_id       INT NOT NULL,
  submitted_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  score            DECIMAL(5,2),
  content_url      VARCHAR(255)
);

CREATE TABLE review (
  review_id        INT AUTO_INCREMENT PRIMARY KEY,
  student_id       INT NOT NULL,
  course_id        INT NOT NULL,
  rating           INT NOT NULL,
  comment          TEXT,
  reviewed_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chat_message (
  chat_id          INT AUTO_INCREMENT PRIMARY KEY,
  module_id        INT NOT NULL,
  student_id       INT,
  message          TEXT NOT NULL,
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE assignment
ADD COLUMN course_id INT NOT NULL,
ADD CONSTRAINT fk_assignment_course
FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE;

ALTER TABLE assignment DROP COLUMN max_score;

ALTER TABLE assignment 
ADD COLUMN max_score INT NULL AFTER due_date;

Select * from assignment;

SELECT * FROM module;

select * from course;

SELECT * FROM assignment;

select * from quiz;

select * from instructor;

select * from lesson;

SELECT * FROM assignment WHERE assignment_id = 10;


SELECT * FROM student WHERE student_id = 7;


SELECT * FROM assignment WHERE assignment_id = 4;


DESCRIBE submission;

ALTER TABLE submission ADD COLUMN course_id INT;


select * from student;


SELECT * FROM course WHERE instructor_id = 3;


DESCRIBE quiz;

ALTER TABLE quiz ADD COLUMN course_id INT;


ALTER TABLE review
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE review
ADD COLUMN average_rating DECIMAL(3,2) DEFAULT 0;

ALTER TABLE student
ADD COLUMN name VARCHAR(255) NOT NULL;

SELECT * FROM review;

SHOW COLUMNS FROM review;
SHOW COLUMNS FROM chat_message;
SHOW CREATE TABLE review;

FLUSH TABLES;

ALTER TABLE review DROP COLUMN average_rating;

SELECT TABLE_NAME, COLUMN_NAME
FROM INFORMATION_SCHEMA.COLUMNS
WHERE COLUMN_NAME = 'average_rating';

SHOW FULL PROCESSLIST;

SHOW TRIGGERS LIKE 'review';

ALTER TABLE student
DROP COLUMN name;


select * FROM chat_message;

delete from chat_message where chat_id = 32;

ALTER TABLE chat_message
CHANGE COLUMN module_id course_id INT;

ALTER TABLE chat_message 
ADD COLUMN instructor_id INT;