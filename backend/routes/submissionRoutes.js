import express from 'express';
import {
  submitAssignment,
  getSubmissionsByAssignment,
  getSubmissionsByStudent,
  getStudentSubmission
} from '../controllers/submissionController.js';
import { authenticate, authorizeInstructor, authorizeStudent } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Student routes
router.post('/submit', authenticate, authorizeStudent, submitAssignment);
router.get('/student/:student_id', authenticate, authorizeStudent, getSubmissionsByStudent); 
router.get('/:assignment_id/student/:student_id', authenticate, getStudentSubmission); 

// Teacher routes
router.get('/assignment/:assignment_id', authenticate, authorizeInstructor, getSubmissionsByAssignment);

export default router;
