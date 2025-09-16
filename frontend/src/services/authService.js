
import axiosInstance from './axiosInstance';


export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    
    if (error.response?.data?.msg) {
      throw new Error(error.response.data.msg);
    } else if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error('Registration failed. Please try again.');
    }
  }
};


export const loginUser = async (userData) => {
  try {
    const response = await axiosInstance.post('/auth/login', userData);
    return response.data;
  } catch (error) {
    
    if (error.response?.data?.msg) {
      throw new Error(error.response.data.msg);
    } else if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error('Login failed. Please check your credentials and try again.');
    }
  }
};