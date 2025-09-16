import { pool } from '../config/db.js';


export const checkSubmissionExists = async (assignment_id, student_id) => {
    const [rows] = await pool.query(
        'SELECT * FROM submission WHERE assignment_id = ? AND student_id = ?',
        [assignment_id, student_id]
    );
    return rows.length > 0;
};


export const insertSubmission = async (assignment_id, student_id, content_url) => {
    const [rows] = await pool.query(
        'INSERT INTO submission (assignment_id, student_id, content_url, submitted_at) VALUES (?, ?, ?, NOW())',
        [assignment_id, student_id, content_url]
    );
    return rows;
};



export const getSubmissionsByAssignment = async (assignment_id) => {
    const [rows] = await pool.query(
        'SELECT s.*, st.f_name, st.l_name FROM submission s JOIN student st ON s.student_id = st.student_id WHERE s.assignment_id = ?',
        [assignment_id]
    );
    return rows;
};

export const getSubmissionsByStudent = async (student_id) => {
    const [rows] = await pool.query(
        'SELECT s.*, a.title AS assignment_title FROM submission s JOIN assignment a ON s.assignment_id = a.assignment_id WHERE s.student_id = ?',
        [student_id]
    );
    return rows;
};
