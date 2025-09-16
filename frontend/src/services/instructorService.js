
import axiosInstance from './axiosInstance';


export const getInstructorCourseDetails = async (instructorId) => {
  try {
    
    const response = await axiosInstance.get(`/instructor/${instructorId}/courses`);
    
    
    console.log('Instructor Course Data:', response.data);  
    
    
    return response.data.data || [];  
  } catch (error) {
    console.error('Error fetching instructor course details:', error);
    throw error; 
  }
};
