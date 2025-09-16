
import * as EnrollmentModel from '../models/enrollmentModel.js';

export const enrollStudent = async (req, res) => {
  const { student_id, course_id } = req.body;

  try {
    const already = await EnrollmentModel.checkEnrollment(student_id, course_id);
    if (already) return res.status(400).json({ msg: 'Already enrolled' });

    await EnrollmentModel.enrollStudent(student_id, course_id);
    res.status(201).json({ msg: 'Enrollment successful' });
  } catch (err) {
    res.status(500).json({ msg: 'Enrollment failed', error: err.message });
  }
};

export const getEnrollmentsByStudent = async (req, res) => {
  const { student_id } = req.params;

  try {
    const rows = await EnrollmentModel.getStudentEnrollments(student_id);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ msg: 'Fetch failed', error: err.message });
  }
};
