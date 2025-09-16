import * as ReviewModel from '../models/reviewModel.js';

export const submitReview = async (req, res) => {
  const { student_id, course_id, rating, comment } = req.body;

  try {
    
    await ReviewModel.createReview(course_id, student_id, rating, comment);

    res.status(201).json({ msg: 'Review submitted successfully' });
  } catch (err) {
   
    console.error('Error submitting review:', err);
    res.status(500).json({ msg: 'Submission failed', error: err.message });
  }
};

export const getReviewsByCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    
    const reviews = await ReviewModel.getReviewsForCourse(courseId);
    if (reviews.length === 0) {
      return res.status(200).json({ msg: 'No reviews found for this course' });
    }
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ msg: 'Fetch failed', error: err.message });
  }
};