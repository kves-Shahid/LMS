
import { pool } from '../config/db.js';

export const createCourse = async (instructor_id, title, description, category, language, price, status = 'draft') => {
  const [result] = await pool.query(
    `INSERT INTO course (instructor_id, title, description, category, language, price, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
    [instructor_id, title, description, category, language, price, status]
  );
  return result.insertId;  
};


export const updateCourse = async (course_id, title, description, category, language, price, status) => {
  await pool.query(
    `UPDATE course
     SET title = ?, description = ?, category = ?, language = ?, price = ?, status = ?
     WHERE course_id = ?`,
    [title, description, category, language, price, status, course_id]
  );
};

export const deleteCourse = async (course_id) => {
  await pool.query(
    `DELETE FROM course WHERE course_id = ?`,
    [course_id]
  );
};

export const fetchPublishedCourses = async () => {
  const [rows] = await pool.query(
    `SELECT * FROM course WHERE status = "published"`
  );
  return rows;
};


export const fetchCourseById = async (course_id) => {
  const [rows] = await pool.query(
    `SELECT * FROM course WHERE course_id = ?`,
    [course_id]
  );
  return rows[0] || null;
};

export const fetchInstructorCourses = async (instructor_id) => {
  const [rows] = await pool.query(
    `SELECT * FROM course WHERE instructor_id = ?`,
    [instructor_id]
  );
  return rows;
};