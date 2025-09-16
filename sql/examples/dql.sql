

-- All students
SELECT * FROM student;

-- Courses with instructor names
SELECT c.title, i.full_name
FROM course c
JOIN instructor i ON c.instructor_id = i.instructor_id;

-- Enrollments (showing student-course pairs)
SELECT e.student_id, s.f_name, c.title
FROM enrollment e
JOIN student s ON e.student_id = s.student_id
JOIN course c ON e.course_id = c.course_id;
