import express from 'express';
import {
  getAdminDashboardStats,
  getStudentDashboard,
  getInstructorDashboard
} from '../controllers/dashboardController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();


router.get('/admin', authenticate, getAdminDashboardStats);


router.get('/student/:student_id', authenticate, getStudentDashboard);


router.get('/instructor/:instructor_id', authenticate, getInstructorDashboard);

export default router;
