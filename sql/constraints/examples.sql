


INSERT INTO enrollment (student_id, course_id)
VALUES (9999, 1); 


INSERT INTO student (user_name, password, email, phone_no, f_name, l_name, status)
VALUES ('jane123', 'hashpass', 'jane@example.com', '1112223333', 'Jane', 'Doe', 'active');

INSERT INTO student (user_name, password, email, phone_no, f_name, l_name, status)
VALUES ('jane456', 'hashpass2', 'janey@example.com', '4445556666', 'Janey', 'Doe', 'active');

INSERT INTO course (instructor_id, title, description, category, language, price)
VALUES (1, 'Invalid Course', 'Test', 'Test', 'English', 99.99);
