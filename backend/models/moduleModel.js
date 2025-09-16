import { pool } from '../config/db.js';

export const createModule = async (course_id, title, description, position) => {
  const [result] = await pool.query(
    `INSERT INTO module (course_id, title, description, position, created_at)
     VALUES (?, ?, ?, ?, NOW())`,
    [course_id, title, description, position]
  );
  return result.insertId;
};

export const getModulesByCourse = async (course_id) => {
  const [rows] = await pool.query(
    'SELECT * FROM module WHERE course_id = ? ORDER BY position',
    [course_id]
  );
  return rows;
};

export const getModuleById = async (moduleId) => {
  const [rows] = await pool.query(
    'SELECT * FROM module WHERE module_id = ?',
    [moduleId]
  );
  return rows[0] || null;
};

export const updateModule = async (moduleId, updates) => {
  const allowedFields = ['title', 'description', 'position'];
  const fieldsToUpdate = Object.keys(updates).filter(k => allowedFields.includes(k));
  
  if (!fieldsToUpdate.length) throw new Error('No valid fields to update');

  const setClause = fieldsToUpdate.map(f => `${f} = ?`).join(', ');
  const values = fieldsToUpdate.map(f => updates[f]);
  values.push(moduleId);

  const [result] = await pool.query(
    `UPDATE module SET ${setClause} WHERE module_id = ?`,
    values
  );
  return result.affectedRows > 0;
};

export const deleteModule = async (moduleId) => {
  const [result] = await pool.query(
    'DELETE FROM module WHERE module_id = ?',
    [moduleId]
  );
  return result.affectedRows > 0;
};