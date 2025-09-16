

-- 1. INNER JOIN: Get students and their enrolled courses
SELECT 
  s.student_id,
  CONCAT(s.f_name, ' ', s.l_name) AS student_name,
  c.title AS course_title
FROM student s
INNER JOIN enrollment e ON s.student_id = e.student_id
INNER JOIN course c ON e.course_id = c.course_id;

-- 2. LEFT JOIN: All instructors and their courses (even if none)
SELECT 
  i.instructor_id,
  i.full_name,
  c.title AS course_title
FROM instructor i
LEFT JOIN course c ON i.instructor_id = c.instructor_id;

-- 3. RIGHT JOIN: Modules with or without assigned lessons
SELECT 
  m.module_id,
  m.title AS module_title,
  l.title AS lesson_title
FROM lesson l
RIGHT JOIN module m ON l.module_id = m.module_id;

-- 4. CROSS JOIN: Every student and every course (e.g. for test case generation)
SELECT 
  s.student_id,
  s.user_name,
  c.course_id,
  c.title AS course_title
FROM student s
CROSS JOIN course c;


