// src/services/courseService.js
import axiosInstance from './axiosInstance';


export const getPublishedCourses = async () => {
  try {
    const { data } = await axiosInstance.get('/courses');
    return data;
  } catch (error) {
    console.error('Error fetching published courses:', error);
    throw error;
  }
};


export const getCourseById = async (courseId) => {
  try {
    const { data } = await axiosInstance.get(`/courses/${courseId}`);
    return data;
  } catch (error) {
    console.error('Error fetching course by ID:', error);
    throw error;
  }
};

export const getInstructorCourses = async () => {
  try {
    const { data } = await axiosInstance.get('/courses/instructor/courses');
    return data;
  } catch (error) {
    console.error('Error fetching instructor courses:', error);
    throw error;
  }
};

export const createCourse = async (courseData) => {
  try {
    const { data } = await axiosInstance.post('/courses/create', courseData);
    return data;
  } catch (error) {
    console.error('Error creating course:', error);
    
    if (error.response?.data?.msg) {
      throw new Error(error.response.data.msg);
    } else if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error('Failed to create course. Please try again.');
    }
  }
};


export const updateCourse = async (courseId, payload) => {
  try {
    const { data } = await axiosInstance.put(`/courses/${courseId}`, payload);
    return data;
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
};


export const deleteCourse = async (courseId) => {
  try {
    const { data } = await axiosInstance.delete(`/courses/${courseId}`);
    return data;
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};