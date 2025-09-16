
import * as InstructorModel from '../models/instructorModel.js';

export const getInstructorProfile = async (req, res) => {
  const instructor_id = req.user.instructor_id;
  try {
    const instructor = await InstructorModel.getInstructorById(instructor_id);
    if (!instructor) return res.status(404).json({ msg: 'Instructor not found' });
    res.json(instructor);
  } catch (err) {
    res.status(500).json({ msg: 'Fetch failed', error: err.message });
  }
};

export const getInstructorCourses = async (req, res) => {
  const instructor_id = req.user.instructor_id;  // Get instructor_id from the authenticated user
  try {
    const courses = await InstructorModel.getCoursesByInstructor(instructor_id); // Ensure this is correct
    res.json(courses); // Return courses
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch instructor courses', error: err.message });
  }
};


export const updateInstructorSocials = async (req, res) => {
  const instructor_id = req.user.instructor_id;
  const { socials } = req.body;

  try {
    await InstructorModel.updateSocials(instructor_id, socials);
    res.json({ msg: 'Social links updated successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Update failed', error: err.message });
  }
};
