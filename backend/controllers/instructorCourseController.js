import { getInstructorCourseDetails } from '../models/instructorCourseModel.js';


export const getInstructorCourseStats = async (req, res) => {
  const { instructor_id } = req.params; 
  
  try {
    const courseDetails = await getInstructorCourseDetails(instructor_id);
    
    if (courseDetails.length === 0) {
      return res.status(404).json({ message: 'No courses found for this instructor' });
    }

    return res.status(200).json({
      message: 'Instructor course details fetched successfully',
      data: courseDetails
    });
  } catch (error) {
    console.error('Error fetching course details for instructor:', error);
    return res.status(500).json({ message: 'Error fetching course details', error: error.message });
  }
};
