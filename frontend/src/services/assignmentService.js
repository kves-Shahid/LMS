
import axiosInstance from './axiosInstance';

// Create a new assignment
export const createAssignment = async (assignmentData) => {
  try {
    const response = await axiosInstance.post('/assignments/create', assignmentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get assignments by module ID
export const getAssignmentsByModule = async (moduleId) => {
  try {
    const response = await axiosInstance.get(`/assignments/module/${moduleId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get assignments by course ID
export const getAssignmentsByCourse = async (courseId) => {
  try {
    const response = await axiosInstance.get(`/assignments/course/${courseId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get assignment by ID
export const getAssignmentById = async (assignmentId) => {
  try {
    const response = await axiosInstance.get(`/assignments/${assignmentId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update assignment
export const updateAssignment = async (assignmentId, assignmentData) => {
  try {
    const response = await axiosInstance.put(`/assignments/${assignmentId}`, assignmentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete assignment
export const deleteAssignment = async (assignmentId) => {
  try {
    const response = await axiosInstance.delete(`/assignments/${assignmentId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};