
import express from 'express';
import {
  getInstructorProfile,
  getInstructorCourses,
  updateInstructorSocials
} from '../controllers/instructorController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authenticate);
router.get('/me', getInstructorProfile);
router.get('/courses', getInstructorCourses);
router.put('/socials', updateInstructorSocials);

export default router;
