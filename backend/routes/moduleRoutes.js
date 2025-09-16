import express from 'express';
import { 
  createModule, 
  getModulesByCourse, 
  getModuleById, 
  updateModule, 
  deleteModule 
} from '../controllers/moduleController.js';
import { authenticate, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();


router.post('/create', authenticate, authorizeRoles('instructor'), createModule);


router.get('/course/:courseId', authenticate, getModulesByCourse);


router.get('/:moduleId', authenticate, getModuleById);


router.put('/:moduleId', authenticate, authorizeRoles('instructor'), updateModule);


router.delete('/:moduleId', authenticate, authorizeRoles('instructor'), deleteModule);

export default router;