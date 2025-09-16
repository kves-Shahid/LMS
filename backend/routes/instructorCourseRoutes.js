import express from 'express';
import { getInstructorCourseStats } from '../controllers/instructorCourseController.js';

const router = express.Router();


router.get('/instructor/:instructor_id/courses', getInstructorCourseStats);

export default router;
