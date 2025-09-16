
import * as AdminModel from '../models/adminModel.js';

export const getAllStudents = async (_req, res) => {
  try {
    const students = await AdminModel.fetchAllStudents();
    res.json(students);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch students', error: err.message });
  }
};

export const getAllInstructors = async (_req, res) => {
  try {
    const instructors = await AdminModel.fetchAllInstructors();
    res.json(instructors);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch instructors', error: err.message });
  }
};

export const getAllCourses = async (_req, res) => {
  try {
    const courses = await AdminModel.fetchAllCourses();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch courses', error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  const { role, id } = req.params;
  const allowedRoles = ['student', 'instructor'];

  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ msg: 'Invalid user role' });
  }

  try {
    const deleted = await AdminModel.deleteUserById(role, id);
    if (!deleted) {
      return res.status(404).json({ msg: `${role} not found` });
    }
    res.json({ msg: `${role} deleted successfully` });
  } catch (err) {
    res.status(500).json({ msg: 'Delete failed', error: err.message });
  }
};
