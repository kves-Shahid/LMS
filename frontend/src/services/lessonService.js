
import axiosInstance from './axiosInstance';


export const createLesson = async (lessonData) => {
  try {
    const response = await axiosInstance.post('/lessons/create', lessonData);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getLessonsByModule = async (moduleId) => {
  try {
    const response = await axiosInstance.get(`/lessons/module/${moduleId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
