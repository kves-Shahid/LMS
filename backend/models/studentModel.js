
import { pool } from '../config/db.js';

export const getAllStudents = async () => {
  const [rows] = await pool.query('SELECT * FROM student');
  return rows;
};

export const getStudentById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM student WHERE student_id = ?', [id]);
  return rows[0];
};

export const getStudentFullName = async (id) => {
  const [rows] = await pool.query('SELECT fn_student_full_name(?) AS full_name', [id]);
  return rows[0].full_name;
};

export const getEnrolledCourses = async (student_id) => {
  const [rows] = await pool.query(
    `SELECT c.* FROM course c
     JOIN enrollment e ON c.course_id = e.course_id
     WHERE e.student_id = ?`,
    [student_id]
  );
  return rows;
};


export const getStudentProgress = async (student_id) => {
  const [rows] = await pool.query(
    `SELECT
      (SELECT COUNT(*) FROM enrollment WHERE student_id = ?) AS enrolled_courses,
      (SELECT COUNT(*) FROM submission WHERE student_id = ?) AS submitted_assignments,
      (SELECT COUNT(*) FROM quiz_attempt WHERE student_id = ?) AS quiz_attempts`,
    [student_id, student_id, student_id]
  );
  return rows[0];
};
