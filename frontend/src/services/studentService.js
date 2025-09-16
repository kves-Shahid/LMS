
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


export const getCourseDetails = async (courseId) => {
  try {
    const response = await axiosInstance.get(`/courses/${courseId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPublishedCourses = async () => {
  try {
    const response = await axiosInstance.get('/courses');
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getModulesByCourse = async (courseId) => {
  try {
    const response = await axiosInstance.get(`/modules/course/${courseId}`);
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

export const getLessonContent = async (lessonId) => {
  try {
    const response = await axiosInstance.get(`/lessons/${lessonId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getAssignmentsByCourse = async (courseId) => {
  try {
    const response = await axiosInstance.get(`/assignments/course/${courseId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const submitAssignment = async (assignmentData) => {
  try {
    // Validate the data
    const submissionData = {
      assignment_id: assignmentData.assignment_id,
      student_id: assignmentData.student_id,
      content_url: assignmentData.content_url
    };

  
    const submissionCheckResponse = await axiosInstance.get(`/submissions/assignment/${assignmentData.assignment_id}/student/${assignmentData.student_id}`);
    
    if (submissionCheckResponse.data) {
      throw new Error('Assignment already submitted');
    }

    const response = await axiosInstance.post('/submissions/submit', submissionData);
    return response.data;
  } catch (error) {
    
    if (error.response?.status === 400) {
      throw new Error('Assignment submission failed: Invalid data or already submitted');
    } else if (error.response?.status === 403) {
      throw new Error('Assignment submission failed: Not enrolled in this course');
    } else if (error.response?.status === 404) {
      throw new Error('Assignment submission failed: Assignment not found');
    } else {
      throw new Error(`Assignment submission failed: ${error.message}`);
    }
  }
};

export const getStudentSubmissions = async (studentId) => {
  try {
    const response = await axiosInstance.get(`/submissions/student/${studentId}`);
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
    console.error('Error fetching quizzes:', error);
    throw error; // re-throw the error to be handled later
  }
};


export const submitQuiz = async (quizData) => {
  try {
    const response = await axiosInstance.post('/quiz/submit', quizData);
    return response.data;
  } catch (error) {
    console.error('Error submitting quiz:', error);
    throw error; // re-throw the error for frontend handling
  }
};


export const submitReview = async (reviewData) => {
  try {
    const response = await axiosInstance.post('/reviews/submit', reviewData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getReviewsByCourse = async (courseId) => {
  try {
    const response = await axiosInstance.get(`/reviews/course/${courseId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getStudentProgress = async (studentId) => {
  try {
    const response = await axiosInstance.get(`/students/${studentId}/progress`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
