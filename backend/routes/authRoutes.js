import express from 'express';
import { login, register } from '../controllers/authController.js';
import { isValidEmail, isValidPassword } from '../utils/validateInput.js';

const router = express.Router();


router.post('/register', (req, res, next) => {
  const { email, password } = req.body;
  if (!isValidEmail(email) || !isValidPassword(password)) {
    return res.status(400).json({ msg: 'Invalid email or password' });
  }
  next();
}, register);

router.post('/login', login);

export default router;
