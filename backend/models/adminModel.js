
import { pool } from '../config/db.js';

export const fetchAllStudents = async () => {
  const [rows] = await pool.query('SELECT * FROM student');
  return rows;
};

export const fetchAllInstructors = async () => {
  const [rows] = await pool.query('SELECT * FROM instructor');
  return rows;
};

export const fetchAllCourses = async () => {
  const [rows] = await pool.query('SELECT * FROM course');
  return rows;
};

export const deleteUserById = async (role, id) => {
  const [result] = await pool.query(
    `DELETE FROM ${role} WHERE ${role}_id = ?`,
    [id]
  );
  return result.affectedRows > 0;
};
