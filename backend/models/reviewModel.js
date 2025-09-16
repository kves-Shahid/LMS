import { pool } from '../config/db.js';


export const createReview = async (course_id, student_id, rating, comment) => {
  const [result] = await pool.query(
    `INSERT INTO review (course_id, student_id, rating, comment, created_at)
     VALUES (?, ?, ?, ?, NOW())`, 
    [course_id, student_id, rating, comment]
  );
  return result.insertId; 
};


export const getReviewsForCourse = async (courseId) => {
  const [rows] = await pool.query(
    `SELECT r.review_id, r.student_id, r.course_id, r.rating, r.comment, r.reviewed_at, r.created_at
     FROM review r 
     WHERE r.course_id = ? 
     ORDER BY r.created_at DESC`,
    [courseId]
  );
  return rows;
};
