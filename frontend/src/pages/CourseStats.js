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
      const reviewsData = await getReviewsForCourse(course_id);
      if (reviewsData.msg) {
        setReviews([]);
        console.log(reviewsData.msg);
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
      await fetchReviews();
    }
    setShowReviews(!showReviews);
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        <p className="text-center text-muted mt-3">Loading course statistics...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-2">Course Statistics</h2>
          {course && (
            <h4 className="text-muted">{course.title}</h4>
          )}
        </div>
        <Link to={`/courses/${course_id}`} className="btn btn-outline-primary d-flex align-items-center">
          <i className="bi bi-arrow-left me-2"></i>Back to Course
        </Link>
      </div>

      {stats ? (
        <div className="row">
          {/* Statistics Cards */}
          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-0 shadow-sm bg-primary text-white">
              <div className="card-body text-center">
                <div className="d-flex align-items-center justify-content-center mb-3">
                  <i className="bi bi-people-fill fs-1 opacity-75 me-3"></i>
                  <div>
                    <h2 className="fw-bold mb-0">{stats.enrolled_students}</h2>
                    <span className="small">Enrolled Students</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-0 shadow-sm bg-success text-white">
              <div className="card-body text-center">
                <div className="d-flex align-items-center justify-content-center mb-3">
                  <i className="bi bi-clipboard-check fs-1 opacity-75 me-3"></i>
                  <div>
                    <h2 className="fw-bold mb-0">{stats.total_assignments}</h2>
                    <span className="small">Assignments</span>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-0 shadow-sm bg-warning text-white">
              <div className="card-body text-center">
                <div className="d-flex align-items-center justify-content-center mb-3">
                  <i className="bi bi-send-check fs-1 opacity-75 me-3"></i>
                  <div>
                    <h2 className="fw-bold mb-0">{stats.total_submissions}</h2>
                    <span className="small">Submissions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Course Details Card */}
          <div className="col-12 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-light">
                <h5 className="card-title mb-0 fw-semibold">
                  <i className="bi bi-info-circle me-2"></i>
                  Course Details
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="d-flex mb-3">
                      <span className="fw-semibold me-3">Course ID:</span>
                      <span className="text-muted">{stats.course_id}</span>
                    </div>
                    <div className="d-flex mb-3">
                      <span className="fw-semibold me-3">Title:</span>
                      <span className="text-muted">{stats.course_title}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-center mt-4">
                  <button 
                    className="btn btn-primary d-flex align-items-center mx-auto"
                    onClick={toggleReviews}
                  >
                    <i className={`bi ${showReviews ? 'bi-eye-slash' : 'bi-eye'} me-2`}></i>
                    {showReviews ? 'Hide Reviews' : 'View Course Reviews'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="alert alert-warning text-center">
          <i className="bi bi-exclamation-triangle me-2"></i>
          No statistics available for this course.
        </div>
      )}

      {/* Reviews Modal */}
      {showReviews && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <i className="bi bi-star me-2"></i>
                  Course Reviews
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowReviews(false)}
                  aria-label="Close"
                >
                  Close
                </button>
              </div>
              <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                {reviewsLoading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading reviews...</span>
                    </div>
                    <p className="text-muted mt-2">Loading reviews...</p>
                  </div>
                ) : reviews.length > 0 ? (
                  <div>
                    {reviews.map((review, index) => (
                      <div key={index} className="card border-0 shadow-sm mb-3">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div className="text-warning fs-5">
                              {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                            </div>
                            <small className="text-muted">
                              {new Date(review.created_at).toLocaleDateString()}
                            </small>
                          </div>
                          <p className="mb-2">{review.comment}</p>
                          <small className="text-muted">
                            <i className="bi bi-person me-1"></i>
                            Student {review.student_id}
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-5 text-muted">
                    <i className="bi bi-inbox display-4 d-block mb-3"></i>
                    <h5>No reviews yet</h5>
                    <p>This course doesn't have any reviews yet.</p>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowReviews(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <FloatingChatButton course_id={course_id} />
    </div>
  );
};

export default CourseStats;