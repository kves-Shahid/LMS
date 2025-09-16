
-- List of modules in courses with lesson and quiz count

CREATE OR REPLACE VIEW vw_module_outline AS
SELECT 
  m.module_id,
  m.title AS module_title,
  c.title AS course_title,
  COUNT(DISTINCT l.lesson_id) AS total_lessons,
  COUNT(DISTINCT q.quiz_id) AS total_quizzes
FROM module m
JOIN course c ON m.course_id = c.course_id
LEFT JOIN lesson l ON m.module_id = l.module_id
LEFT JOIN quiz q ON m.module_id = q.module_id
GROUP BY m.module_id, c.title;
