import express from 'express';
import { submitReview, getReviewsByCourse } from '../controllers/reviewController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Student submits a review
router.post('/submit', authenticate, submitReview);

// Get reviews for a course
router.get('/course/:courseId', getReviewsByCourse);

export default router;
