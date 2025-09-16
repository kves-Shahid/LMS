
import express from 'express';
import {
  getStudentProfile,
  getStudentProgress
} from '../controllers/studentController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authenticate);
router.get('/me/:student_id', getStudentProfile); 
router.get('/progress', getStudentProgress);       

export default router;
