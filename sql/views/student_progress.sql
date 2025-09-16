
-- Student's progress with quiz and assignment submission counts per course

CREATE OR REPLACE VIEW vw_student_progress AS
SELECT 
  s.student_id,
  CONCAT(s.f_name, ' ', s.l_name) AS student_name,
  c.course_id,
  c.title AS course_title,
  COUNT(DISTINCT qa.attempt_id) AS quiz_attempts,
  COUNT(DISTINCT sub.submission_id) AS assignment_submissions
FROM student s
JOIN enrollment e ON s.student_id = e.student_id
JOIN course c ON e.course_id = c.course_id
LEFT JOIN quiz q ON q.module_id IN (
    SELECT m.module_id FROM module m WHERE m.course_id = c.course_id
)
LEFT JOIN quiz_attempt qa ON qa.quiz_id = q.quiz_id AND qa.student_id = s.student_id
LEFT JOIN assignment a ON a.module_id IN (
    SELECT m.module_id FROM module m WHERE m.course_id = c.course_id
)
LEFT JOIN submission sub ON sub.assignment_id = a.assignment_id AND sub.student_id = s.student_id
GROUP BY s.student_id, c.course_id;
