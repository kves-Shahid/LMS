import express from 'express';
import {
  createAssignment,
  getAssignmentsByModule,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  getAssignmentsByCourse
} from '../controllers/assignmentController.js';
import { submitAssignment, getSubmissionsByStudent } from '../controllers/submissionController.js';
import { authenticate, authorizeInstructor, authorizeStudent } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Teacher routes
router.post('/create', authenticate, authorizeInstructor, createAssignment);
router.get('/module/:module_id', authenticate, getAssignmentsByModule); 
router.get('/:assignmentId', authenticate, getAssignmentById); 
router.put('/:assignmentId', authenticate, authorizeInstructor, updateAssignment);
router.delete('/:assignmentId', authenticate, authorizeInstructor, deleteAssignment);
router.get('/course/:courseId', authenticate, getAssignmentsByCourse); 

// Student routes
router.post('/submit', authenticate, authorizeStudent, submitAssignment);
router.get('/submission/student/:studentId', authenticate, authorizeStudent, getSubmissionsByStudent);

export default router;
