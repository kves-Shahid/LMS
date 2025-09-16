

-- 1. Courses with more than 3 students enrolled
SELECT 
  c.course_id,
  c.title,
  COUNT(e.enrollment_id) AS student_count
FROM course c
JOIN enrollment e ON c.course_id = e.course_id
GROUP BY c.course_id
HAVING COUNT(e.enrollment_id) > 3;

-- 2. Students with more than one quiz attempt (across all quizzes)
SELECT 
  student_id,
  COUNT(*) AS total_attempts
FROM quiz_attempt
GROUP BY student_id
HAVING COUNT(*) > 1;

-- 3. Modules having more than 1 assignment
SELECT 
  module_id,
  COUNT(*) AS assignment_count
FROM assignment
GROUP BY module_id
HAVING COUNT(*) > 1;
