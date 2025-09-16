import React, { useEffect, useState } from 'react';
import { getReviewsForCourse } from '../services/reviewService'; 

const ReviewsList = ({ courseId }) => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getReviewsForCourse(courseId);
        setReviews(data); // Set the reviews
      } catch (err) {
        setError('Failed to fetch reviews. Please try again later.');
      }
    };

    fetchReviews(); // Fetch reviews when the component mounts
  }, [courseId]);

  return (
    <div className="reviews-list">
      <h3>Reviews for this Course</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      {reviews.length === 0 ? (
        <p>No reviews available yet.</p>
      ) : (
        <ul>
          {reviews.map((review) => (
            <li key={review.review_id}>
              <strong>{review.student_name}</strong> ({review.rating}/5)
              <p>{review.comment}</p>
              <p><small>{new Date(review.created_at).toLocaleString()}</small></p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReviewsList;
