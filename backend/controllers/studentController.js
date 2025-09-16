
import * as StudentModel from '../models/studentModel.js';

export const getStudentProfile = async (req, res) => {
  const { student_id } = req.params;
  try {
    const student = await StudentModel.getStudentById(student_id);
    if (!student) return res.status(404).json({ msg: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ msg: 'Fetch failed', error: err.message });
  }
};

export const getStudentCourses = async (req, res) => {
  const { student_id } = req.params;
  try {
    const courses = await StudentModel.getEnrolledCourses(student_id);
    res.json(courses);
  } catch (err) {
    res.status(500).json({ msg: 'Fetch failed', error: err.message });
  }
};


export const getStudentProgress = async (req, res) => {
  const { student_id } = req.user; // from authenticate middleware
  try {
    const progress = await StudentModel.getStudentProgress(student_id);
    res.json(progress);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch progress', error: err.message });
  }
};
