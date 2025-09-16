import * as AuthModel from '../models/authModel.js';
import { hashPassword, comparePassword } from '../utils/hashPassword.js';
import { generateToken } from '../utils/generateToken.js';

export const register = async (req, res) => {
  const { role, user_name, password, email, f_name, l_name, phone_no } = req.body;

  try {
    
    if (!['student', 'instructor', 'admin'].includes(role)) {
      return res.status(400).json({ msg: 'Invalid role' });
    }

    let exists;
    if(role === 'admin'){
      exists = await AuthModel.checkAdminExists(email);
    } else {
      exists = await AuthModel.checkUserExists(role, email);
    }

    if (exists) return res.status(400).json({ msg: 'Email already registered' });

    const hashed = await hashPassword(password);

    let user, token;
    if(role === 'admin'){
      await AuthModel.registerAdmin(user_name, hashed, email);
      user = await AuthModel.fetchAdminByEmail(email);
      token = generateToken({ id: user.admin_id, role });
    } else {
      await AuthModel.registerUser(role, user_name, hashed, email, phone_no, f_name, l_name);
      user = await AuthModel.fetchUserByEmail(role, email);
      token = generateToken({ id: user[`${role}_id`], role });
    }

    res.status(201).json({
      msg: `${role} registered successfully`,
      token,
      user
    });

  } catch (err) {
    res.status(500).json({ msg: 'Registration failed', error: err.message });
  }
};

export const login = async (req, res) => {
  const { role, email, password } = req.body;

  try {
    if (!['student', 'instructor', 'admin'].includes(role)) {
      return res.status(400).json({ msg: 'Invalid role' });
    }

    let user;
    if(role === 'admin'){
      user = await AuthModel.fetchAdminByEmail(email);
    } else {
      user = await AuthModel.fetchUserByEmail(role, email);
    }

    if (!user) return res.status(404).json({ msg: 'User not found' });

    const isValid = await comparePassword(password, user.password);
    if (!isValid) return res.status(401).json({ msg: 'Invalid credentials' });

    const token = generateToken({ id: user.admin_id || user[`${role}_id`], role });
    res.status(200).json({ token, user });

  } catch (err) {
    res.status(500).json({ msg: 'Login failed', error: err.message });
  }
};
