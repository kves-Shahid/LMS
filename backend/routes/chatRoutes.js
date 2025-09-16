
import express from 'express';
import { postMessage, getMessagesByCourse } from '../controllers/chatController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();


router.use(authenticate);


router.post('/send', postMessage);


router.get('/course/:course_id', getMessagesByCourse);

export default router;
