
import express from 'express';
import {
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  getInstructorCourses
} from '../controllers/courseController.js'; 
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();


router.get('/', getAllCourses);


router.use(authenticate);


router.post('/create', createCourse);


router.get('/:course_id', getCourseById);


router.put('/:course_id', updateCourse);


router.delete('/:course_id', deleteCourse);

router.get('/instructor/courses', getInstructorCourses);

export default router;