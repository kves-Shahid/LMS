import { pool } from '../config/db.js';


export const getMessagesByCourse = async (course_id) => {
  const [rows] = await pool.query(
    `SELECT cm.chat_id, cm.course_id, cm.student_id, cm.instructor_id, cm.message, cm.created_at
     FROM chat_message cm
     WHERE cm.course_id = ?
     ORDER BY cm.created_at`, 
    [course_id]
  );
  return rows;
};


export const insertMessage = async (course_id, message, req) => {
  const userId = req.user.id;  
  const userRole = req.user.role;  

 
  let student_id = null;
  let instructor_id = null;

  if (userRole === 'student') {
    student_id = userId;  
  } else if (userRole === 'instructor') {
    instructor_id = userId;  
  }

  const [rows] = await pool.query(
    `INSERT INTO chat_message (course_id, student_id, instructor_id, message, created_at)
     VALUES (?, ?, ?, ?, NOW())`,
    [course_id, student_id || null, instructor_id || null, message] 
  );
  return rows;
};
