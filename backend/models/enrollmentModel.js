
import { pool } from '../config/db.js';

export const checkEnrollment = async (student_id, course_id) => {
  const [rows] = await pool.query(
    'SELECT * FROM enrollment WHERE student_id = ? AND course_id = ?',
    [student_id, course_id]
  );
  return rows.length > 0;
};

export const enrollStudent = async (student_id, course_id) => {
  const [rows] = await pool.query(
    'CALL sp_enroll_student(?, ?)',
    [student_id, course_id]
  );
  return rows;
};

export const getStudentEnrollments = async (student_id) => {
  const [rows] = await pool.query(
    'SELECT c.* FROM course c JOIN enrollment e ON c.course_id = e.course_id WHERE e.student_id = ?',
    [student_id]
  );
  return rows;
};
