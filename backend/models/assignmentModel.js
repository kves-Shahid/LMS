import { pool } from '../config/db.js';



export const createAssignment = async (course_id, module_id, title, description, due_date, max_score = null) => {
    const [rows] = await pool.query(
        `INSERT INTO assignment (course_id, module_id, title, description, due_date, max_score, created_at)
         VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        [course_id, module_id, title, description, due_date, max_score]
    );
    return rows.insertId;
};



 export const getAssignmentsByModule = async (module_id) => {
    const [rows] = await pool.query(
        'SELECT * FROM assignment WHERE module_id = ? ORDER BY created_at DESC',
        [module_id]
    );
    return rows;
};




export const getAssignmentsByCourse = async (courseId) => {
    const [rows] = await pool.query(
        'SELECT * FROM assignment WHERE course_id = ? ORDER BY created_at DESC',
        [courseId]
    );
    return rows;
};




export const getAssignmentById = async (assignmentId) => {
    const [rows] = await pool.query(
        'SELECT * FROM assignment WHERE assignment_id = ?',
        [assignmentId]
    );
    return rows[0] || null;
};


//  Update an assignment

export const updateAssignment = async (assignmentId, updates) => {
    const allowedFields = ['title', 'description', 'due_date', 'max_score'];
    const fieldsToUpdate = Object.keys(updates).filter(k => allowedFields.includes(k));
    if (!fieldsToUpdate.length) throw new Error('No valid fields to update');

    const setClause = fieldsToUpdate.map(f => `${f} = ?`).join(', ');
    const values = fieldsToUpdate.map(f => updates[f]);
    values.push(assignmentId);

    const [rows] = await pool.query(
        `UPDATE assignment SET ${setClause} WHERE assignment_id = ?`,
        values
    );
    return rows.affectedRows > 0;
};


// Delete assignment
 
export const deleteAssignment = async (assignmentId) => {
    const [rows] = await pool.query(
        'DELETE FROM assignment WHERE assignment_id = ?',
        [assignmentId]
    );
    return rows.affectedRows > 0;
};
