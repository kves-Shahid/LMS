
import express from 'express';
import {
  enrollStudent,
  getEnrollmentsByStudent
} from '../controllers/enrollmentController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authenticate);
router.post('/enroll', enrollStudent);
router.get('/:student_id', getEnrollmentsByStudent);

export default router;
