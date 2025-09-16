import axiosInstance from './axiosInstance';


export const getModulesByCourse = async (courseId) => {
  try {
    const response = await axiosInstance.get(`/modules/course/${courseId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getModuleById = async (moduleId) => {
  try {
    const response = await axiosInstance.get(`/modules/${moduleId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createModule = async (moduleData) => {
  try {
    const response = await axiosInstance.post('/modules/create', moduleData);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const updateModule = async (moduleId, moduleData) => {
  try {
    const response = await axiosInstance.put(`/modules/${moduleId}`, moduleData);
    return response.data.module; // Return the updated module object
  } catch (error) {
    throw error;
  }
};


export const deleteModule = async (moduleId) => {
  try {
    const response = await axiosInstance.delete(`/modules/${moduleId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};