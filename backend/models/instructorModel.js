
import { pool } from '../config/db.js';

export const getInstructorById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM instructor WHERE instructor_id = ?', [id]);
  return rows[0];
};

export const getCoursesByInstructor = async (instructor_id) => {
  const [rows] = await pool.query('SELECT * FROM course WHERE instructor_id = ?', [instructor_id]);
  return rows;
};

export const updateSocials = async (instructor_id, socials) => {
  const [rows] = await pool.query(
    'UPDATE instructor SET social_links = ? WHERE instructor_id = ?',
    [JSON.stringify(socials), instructor_id]
  );
  return rows;
};
