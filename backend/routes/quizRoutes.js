
import express from 'express';
import {
  createQuiz,
  submitQuiz,
  getQuizAttempts,
  getQuizzesByModule
} from '../controllers/quizController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authenticate);
router.post('/create', createQuiz);           
router.post('/submit', submitQuiz);           
router.get('/attempts/:quizId', getQuizAttempts); 
router.get('/module/:module_id', getQuizzesByModule);


export default router;
