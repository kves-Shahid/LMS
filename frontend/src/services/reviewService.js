import axiosInstance from './axiosInstance';

export const submitReview = async (studentId, courseId, rating, comment, userRole) => {
  try {
    const response = await axiosInstance.post(
      '/reviews/submit', 
      {
        student_id: studentId,
        course_id: courseId,  
        rating: rating,
        comment: comment,
        role: userRole 
      }
    );
    return response.data; 
  } catch (error) {
    console.error('Error submitting review:', error);
    throw error; 
  }
};


export const getReviewsForCourse = async (courseId) => {
  try {
    const response = await axiosInstance.get(`/reviews/course/${courseId}`);

    
    if (response.data.length === 0) {
      return { msg: 'No reviews found for this course' };
    }

    return response.data; 
  } catch (error) {
    
    console.error('Error fetching reviews:', error);
    throw error; 
  }
};
