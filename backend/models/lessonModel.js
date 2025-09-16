import { pool } from '../config/db.js';

export const createLesson = async (module_id, title, resource, video_url, position) => {
  const [result] = await pool.query(
    `INSERT INTO lesson (module_id, title, resource, video_url, position, created_at)
     VALUES (?, ?, ?, ?, ?, NOW())`,
    [module_id, title, resource, video_url, position]
  );
  return result.insertId;
};

export const getLessonsByModule = async (module_id) => {
  const [rows] = await pool.query(
    'SELECT * FROM lesson WHERE module_id = ? ORDER BY position',
    [module_id]
  );
  return rows;
};

export const getLessonById = async (lesson_id) => {
  const [rows] = await pool.query(
    'SELECT * FROM lesson WHERE lesson_id = ?',
    [lesson_id]
  );
  return rows[0];
};
