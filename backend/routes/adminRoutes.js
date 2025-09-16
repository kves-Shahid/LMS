
import express from 'express';
import {
  getAllStudents,
  getAllInstructors,
  getAllCourses,
  deleteUser
} from '../controllers/adminController.js';
import { authenticate, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authenticate, authorizeRoles('admin')); 

router.get('/students', getAllStudents);
router.get('/instructors', getAllInstructors);
router.get('/courses', getAllCourses);

router.delete('/users/:role/:id', deleteUser); 

export default router;
