

-- 1. Rank students by their latest quiz score in each course
SELECT 
  qa.student_id,
  c.title AS course_title,
  qa.score,
  RANK() OVER (PARTITION BY c.course_id ORDER BY qa.score DESC) AS score_rank
FROM quiz_attempt qa
JOIN quiz q ON qa.quiz_id = q.quiz_id
JOIN module m ON q.module_id = m.module_id
JOIN course c ON m.course_id = c.course_id;

-- 2. Running total of assignment submissions per student
SELECT 
  s.student_id,
  CONCAT(st.f_name, ' ', st.l_name) AS student_name,
  s.submitted_at,
  COUNT(*) OVER (PARTITION BY s.student_id ORDER BY s.submitted_at ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total
FROM submission s
JOIN student st ON s.student_id = st.student_id;

-- 3. Percentile score per quiz
SELECT 
  quiz_id,
  student_id,
  score,
  NTILE(4) OVER (PARTITION BY quiz_id ORDER BY score DESC) AS percentile_group
FROM quiz_attempt;
