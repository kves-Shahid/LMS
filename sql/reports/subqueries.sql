

-- 1. Students enrolled in more than 2 courses
SELECT 
  s.student_id,
  s.user_name,
  (SELECT COUNT(*) FROM enrollment e WHERE e.student_id = s.student_id) AS total_enrollments
FROM student s
WHERE (SELECT COUNT(*) FROM enrollment e WHERE e.student_id = s.student_id) > 2;

-- 2. Instructors who have published courses
SELECT * FROM instructor
WHERE instructor_id IN (
  SELECT instructor_id FROM course WHERE status = 'published'
);

-- 3. Courses without any enrollment
SELECT * FROM course
WHERE course_id NOT IN (
  SELECT DISTINCT course_id FROM enrollment
);
