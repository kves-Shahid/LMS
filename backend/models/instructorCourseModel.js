import { pool } from '../config/db.js';


export const getInstructorCourseDetails = async (instructor_id) => {
  const [rows] = await pool.query(`
    SELECT 
      c.course_id,
      c.title AS course_title,
      (SELECT COUNT(*) FROM enrollment e WHERE e.course_id = c.course_id) AS enrolled_students,
      (SELECT COUNT(*) FROM assignment a WHERE a.course_id = c.course_id) AS total_assignments,
      (SELECT COUNT(*) FROM quiz q WHERE q.course_id = c.course_id) AS total_quizzes,
      (SELECT COUNT(*) FROM submission s WHERE s.course_id = c.course_id) AS total_submissions
    FROM course c
    WHERE c.instructor_id = ?
  `, [instructor_id]);

  return rows;
};
