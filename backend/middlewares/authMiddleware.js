import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];  

    if (!token) {
      return res.status(401).json({ error: 'Authentication token missing' });
    }

    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');

    
    let table = '';
    let key = '';

   
    if (decoded.role === 'student') {
      table = 'student';
      key = 'student_id';
    } else if (decoded.role === 'instructor') {
      table = 'instructor';
      key = 'instructor_id';
    } else if (decoded.role === 'admin') {
      table = 'admin';
      key = 'admin_id';
    } else {
      return res.status(403).json({ error: 'Invalid role' });
    }

   
    const [userRows] = await pool.query(`SELECT * FROM ${table} WHERE ${key} = ?`, [decoded.id]);

    if (!userRows.length) {
      return res.status(401).json({ error: 'User not found' });
    }

  
    req.user = userRows[0];
    req.user.role = decoded.role;  

    
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token', message: err.message });
  }
};


export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Access denied' });
    }
    next();
  };
};


export const authorizeInstructor = authorizeRoles('instructor');


export const authorizeStudent = authorizeRoles('student');
