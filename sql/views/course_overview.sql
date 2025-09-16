

CREATE OR REPLACE VIEW vw_course_overview AS
SELECT 
  c.course_id,
  c.title AS course_title,
  c.category,
  c.language,
  c.status,
  c.price,
  i.full_name AS instructor_name,
  COUNT(e.enrollment_id) AS total_enrollments
FROM course c
LEFT JOIN instructor i ON c.instructor_id = i.instructor_id
LEFT JOIN enrollment e ON c.course_id = e.course_id
GROUP BY c.course_id, i.full_name;
