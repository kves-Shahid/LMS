
import axiosInstance from './axiosInstance';


export const enrollStudent = async (enrollmentData) => {
  try {
    const response = await axiosInstance.post('/enrollments/enroll', enrollmentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getStudentCourses = async (studentId) => {
  try {
    const response = await axiosInstance.get(`/enrollments/${studentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    return [];
  }
};