import { pool } from '../config/db.js';

export const getDashboardStats = async () => {
  const [result] = await pool.query(`
    SELECT 
      (SELECT COUNT(*) FROM student) AS student_count,
      (SELECT COUNT(*) FROM instructor) AS instructor_count,
      (SELECT COUNT(*) FROM course) AS course_count,
      (SELECT COUNT(*) FROM assignment) AS assignment_count
  `);
  return result[0];
};

export const getStudentStats = async (student_id) => {
  const [result] = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM enrollment WHERE student_id = ?) AS enrolled_courses,
      (SELECT COUNT(*) FROM submission WHERE student_id = ?) AS submitted_assignments,
      (SELECT COUNT(*) FROM quiz_attempt WHERE student_id = ?) AS quiz_attempts
  `, [student_id, student_id, student_id]);
  return result[0];
};

export const getInstructorStats = async (instructor_id) => {
  const [result] = await pool.query(`
    SELECT
      COUNT(DISTINCT c.course_id) AS total_courses,
      COUNT(DISTINCT a.assignment_id) AS total_assignments,
      COUNT(DISTINCT q.quiz_id) AS total_quizzes
    FROM instructor i
    LEFT JOIN course c ON i.instructor_id = c.instructor_id
    LEFT JOIN assignment a ON c.course_id = a.course_id
    LEFT JOIN module m ON c.course_id = m.course_id
    LEFT JOIN quiz q ON m.module_id = q.module_id
    WHERE i.instructor_id = ?
    GROUP BY i.instructor_id
  `, [instructor_id]);
  return result[0];
};
