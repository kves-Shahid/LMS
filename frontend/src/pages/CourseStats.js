import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getInstructorCourseDetails } from '../services/instructorService';
import { getReviewsForCourse } from '../services/reviewService'; 

import FloatingChatButton from '../components/FloatingChatButton';

const CourseStats = () => {
  const [stats, setStats] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviews, setShowReviews] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const { course_id } = useParams();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const instructorId = localStorage.getItem('userId') || localStorage.getItem('instructor_id');
        
        if (instructorId) {
          const courseData = await getInstructorCourseDetails(instructorId);
          
          if (Array.isArray(courseData)) {
            const currentCourse = courseData.find(c => c.course_id === parseInt(course_id));
            if (currentCourse) {
              setCourse(currentCourse);
              
              const realStats = {
                course_id: currentCourse.course_id,
                course_title: currentCourse.course_title,
                enrolled_students: currentCourse.enrolled_students || 0,
                total_assignments: currentCourse.total_assignments || 0,
                total_quizzes: currentCourse.total_quizzes || 0,
                total_submissions: currentCourse.total_submissions || 0,
              };

              setStats(realStats);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch course stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [course_id]);

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const reviewsData = await getReviewsForCourse(course_id); // Use correct function name
      if (reviewsData.msg) {
        setReviews([]);
        console.log(reviewsData.msg); // Show the message when no reviews are found
      } else {
        setReviews(reviewsData);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const toggleReviews = async () => {
    if (!showReviews && reviews.length === 0) {
      await fetchReviews(); // Only fetch if reviews haven't been loaded yet
    }
    setShowReviews(!showReviews);
  };

  if (loading) {
    return <div className="container">Loading stats...</div>;
  }

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Course Statistics</h2>
          {course && (
            <h4 className="text-muted">{course.title}</h4>
          )}
        </div>
        <Link to={`/courses/${course_id}`} className="btn btn-secondary">
          Back to Course
        </Link>
      </div>

      {stats ? (
        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="card">
              <div className="card-header">
                <h5>Course Information</h5>
              </div>
              <div className="card-body">
                <p><strong>Course ID:</strong> {stats.course_id}</p>
                <p><strong>Course Title:</strong> {stats.course_title}</p>
                <p><strong>Total Students:</strong> {stats.enrolled_students}</p>
                <p><strong>Total Assignments:</strong> {stats.total_assignments}</p>
                <p><strong>Total Quizzes:</strong> {stats.total_quizzes}</p>
                <p><strong>Total Submissions:</strong> {stats.total_submissions}</p>
                
                <button 
                  className="btn btn-primary mt-3"
                  onClick={toggleReviews}
                >
                  {showReviews ? 'Hide Reviews' : 'View Course Reviews'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="alert alert-warning">
          No statistics available for this course.
        </div>
      )}

      {/* Reviews Floating Window */}
      {showReviews && (
        <div className="card" style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          maxWidth: '600px',
          maxHeight: '80vh',
          overflowY: 'auto',
          zIndex: 1050,
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}>

          {/* Reviews Header */}
          <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Course Reviews</h5>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={() => setShowReviews(false)}
              aria-label="Close"
            ></button>
          </div>

          {/* Reviews Body */}
          <div className="card-body">
            {reviewsLoading ? (
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading reviews...</span>
                </div>
              </div>
            ) : reviews.length > 0 ? (
              <div>
                {reviews.map((review, index) => (
                  <div key={index} className="border-bottom pb-3 mb-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <strong className="text-warning">
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </strong>
                      <small className="text-muted">
                        {new Date(review.created_at).toLocaleDateString()}
                      </small>
                    </div>
                    <p className="mb-1">{review.comment}</p>
                    <small className="text-muted">- Student {review.student_id}</small>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted py-4">
                No reviews yet for this course.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Overlay */}
      {showReviews && (
        <div 
          className="modal-backdrop show"
          style={{ zIndex: 1040 }}
          onClick={() => setShowReviews(false)}
        ></div>
      )}

      {/* Floating Chat Button (Visible Only on Course Stats Page) */}
      <FloatingChatButton course_id={course_id} />
    </div>
  );
};

export default CourseStats;
