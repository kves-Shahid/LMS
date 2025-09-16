import React, { useState } from 'react';  
import { useParams } from 'react-router-dom'; 
import { submitReview } from '../services/reviewService'; 

const SubmitReview = () => {
  const { course_id } = useParams();  
  const [rating, setRating] = useState(1); 
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    if (!comment.trim()) {
      setError('Comment cannot be empty.');
      setIsSubmitting(false);
      return;
    }

    const studentId = localStorage.getItem('student_id'); 
    const userRole = localStorage.getItem('userRole'); 

    
    if (!userRole || userRole !== 'student') {
      setError('Only students can submit reviews.');
      setIsSubmitting(false);
      return;
    }

    
    if (!studentId) {
      setError('Student ID is missing. Please log in again.');
      setIsSubmitting(false);
      return;
    }

    try {
      
      const result = await submitReview(studentId, course_id, rating, comment, userRole);
      
      
      setSuccessMessage(result.msg || 'Review submitted successfully!');
      
      
      setComment('');
      setRating(1);
    } catch (err) {
      setError('Failed to submit review. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h3 className="card-title mb-0">✍️ Submit Your Review</h3>
            </div>
            
            <div className="card-body">
              {/* Display success or error message */}
              {successMessage && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  {successMessage}
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setSuccessMessage('')}
                  >
                    <span className="visually-hidden">Close</span>
                  </button>
                </div>
              )}
              
              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  {error}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setError('')}
                  >
                    <span className="visually-hidden">Close</span>
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="rating" className="form-label fw-bold">
                    Rating: <span className="text-warning">{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>
                  </label>
                  <select 
                    className="form-select"
                    id="rating"
                    value={rating} 
                    onChange={(e) => setRating(Number(e.target.value))}
                    disabled={isSubmitting}
                  >
                    <option value={1}>1 Star</option>
                    <option value={2}>2 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={5}>5 Stars</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="comment" className="form-label fw-bold">Your Review:</label>
                  <textarea
                    className="form-control"
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows="5"
                    placeholder="Share your experience with this course..."
                    disabled={isSubmitting}
                  />
                  <div className="form-text">Your honest feedback helps other students make informed decisions.</div>
                </div>

                {/* Hidden field for course_id */}
                <input type="hidden" value={course_id} />

                <div className="d-grid">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Submitting...
                      </>
                    ) : (
                      'Submit Review'
                    )}
                  </button>
                </div>
              </form>
            </div>
            
            <div className="card-footer text-muted">
              <small>Your review will be visible to other students after approval.</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitReview;