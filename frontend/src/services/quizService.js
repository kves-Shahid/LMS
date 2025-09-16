
import axiosInstance from './axiosInstance';


export const createQuiz = async (quizData) => {
  try {
    const response = await axiosInstance.post('/quiz/create', quizData);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getQuizzesByModule = async (moduleId) => {
  try {
    const response = await axiosInstance.get(`/quiz/module/${moduleId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const submitQuiz = async (quizData) => {
  try {
    const response = await axiosInstance.post('/quiz/submit', quizData);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getQuizAttempts = async (quizId) => {
  try {
    const response = await axiosInstance.get(`/quiz/attempts/${quizId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};