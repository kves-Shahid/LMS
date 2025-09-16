import express from 'express';
import {
  getLessonsByModule,
  getLessonContent,
  createLesson
} from '../controllers/lessonController.js';
import { authenticate, authorizeInstructor } from '../middlewares/authMiddleware.js';

const router = express.Router();


router.use(authenticate);


router.post('/create', authorizeInstructor, createLesson);


router.get('/module/:moduleId', getLessonsByModule);


router.get('/:lessonId', getLessonContent);

export default router;
