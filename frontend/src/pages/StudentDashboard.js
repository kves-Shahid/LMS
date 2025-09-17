import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPublishedCourses } from '../services/courseService';
import { enrollStudent, getStudentCourses } from '../services/enrollmentService';

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(6); // 2 rows of 3 courses

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const availableCourses = await getPublishedCourses();
        setCourses(availableCourses);
        
        const studentId = localStorage.getItem('student_id');
        
        if (studentId) {
          const enrolled = await getStudentCourses(studentId);
          setEnrolledCourses(enrolled);
        }
        
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const availableForEnrollment = courses.filter(course => 
    !enrolledCourses.some(enrolled => enrolled.course_id === course.course_id)
  );

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = availableForEnrollment.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(availableForEnrollment.length / coursesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleEnroll = async (courseId) => {
    try {
      const studentId = localStorage.getItem('student_id');
      const userRole = localStorage.getItem('userRole');
      
      if (!studentId) {
        alert('You must be logged in as a student to enroll.');
        return;
      }

      if (userRole !== 'student') {
        alert('Only students can enroll in courses.');
        return;
      }

      const response = await enrollStudent({ 
        student_id: parseInt(studentId), 
        course_id: courseId 
      });
      
      if (response.msg === 'Enrollment successful') {
        alert('You have successfully enrolled in the course!');
        
        const updatedEnrolled = await getStudentCourses(studentId);
        setEnrolledCourses(updatedEnrolled);
        
        setCurrentPage(1);
      }
    } catch (err) {
      console.error('Enrollment error:', err);
      alert('Failed to enroll in the course. ' + (err.response?.data?.msg || 'Please try again.'));
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        <p className="text-center text-muted">Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger text-center my-4">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-2">Student Dashboard</h2>
          <p className="text-muted">Manage your learning journey</p>
        </div>
        <div className="d-flex align-items-center">
          <span className="badge bg-primary me-3">
            <i className="bi bi-person me-1"></i>
            Student
          </span>
        </div>
      </div>

      {/* Enrolled Courses Section */}
      <div className="card shadow-sm border-0 mb-5">
        <div className="card-header bg-white">
          <h4 className="card-title mb-0 fw-bold">
            <i className="bi bi-journal-check me-2"></i>
            Your Enrolled Courses ({enrolledCourses.length})
          </h4>
        </div>
        <div className="card-body">
          {enrolledCourses.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-journal-plus display-4 text-muted mb-3"></i>
              <h5 className="text-muted">No enrolled courses yet</h5>
              <p className="text-muted">Browse available courses below to start learning</p>
            </div>
          ) : (
            <div className="row">
              {enrolledCourses.map((course) => (
                <div key={course.course_id} className="col-lg-6 col-xl-4 mb-4">
                  <div className="card h-100 shadow-sm border-0">
                    <div className="card-header bg-info text-white">
                      <h6 className="card-title mb-0 fw-semibold">{course.title}</h6>
                    </div>
                    <div className="card-body d-flex flex-column">
                      <p className="card-text text-muted flex-grow-1">
                        {course.description || 'No description available'}
                      </p>
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <span className="badge bg-info">
                          <i className="bi bi-check-circle me-1"></i>Enrolled
                        </span>
                        <Link 
                          to={`/student/course/${course.course_id}`} 
                          className="btn btn-primary btn-sm d-flex align-items-center"
                        >
                          <i className="bi bi-play-circle me-1"></i>Start Learning
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Available Courses Section */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white">
          <h4 className="card-title mb-0 fw-bold">
            <i className="bi bi-journal-plus me-2"></i>
            Available Courses ({availableForEnrollment.length})
          </h4>
        </div>
        <div className="card-body">
          {availableForEnrollment.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-check-circle display-4 text-primary mb-3"></i>
              <h5 className="text-muted">You've enrolled in all available courses!</h5>
              <p className="text-muted">Check back later for new course offerings</p>
            </div>
          ) : (
            <>
              <div className="row">
                {currentCourses.map((course) => (
                  <div key={course.course_id} className="col-lg-6 col-xl-4 mb-4">
                    <div className="card h-100 shadow-sm border-0">
                      <div className="card-header bg-primary text-white">
                        <h6 className="card-title mb-0 fw-semibold">{course.title}</h6>
                      </div>
                      <div className="card-body d-flex flex-column">
                        <p className="card-text text-muted flex-grow-1">
                          {course.description || 'No description available'}
                        </p>
                        
                        <div className="mb-3">
                          <small className="text-muted">
                            <i className="bi bi-person me-1"></i>
                            Instructor {course.instructor_id}
                          </small>
                        </div>

                        <div className="d-flex justify-content-between align-items-center mt-auto">
                          <span className="badge bg-secondary">
                            <i className="bi bi-currency-dollar me-1"></i>
                            {course.price === 0 || course.price === '0.00' ? 'FREE' : `$${course.price}`}
                          </span>
                          <button
                            className="btn btn-primary btn-sm d-flex align-items-center"
                            onClick={() => handleEnroll(course.course_id)}
                          >
                            <i className="bi bi-plus-circle me-1"></i>Enroll Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {availableForEnrollment.length > coursesPerPage && (
                <nav className="d-flex justify-content-center mt-5">
                  <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <i className="bi bi-chevron-left"></i> Previous
                      </button>
                    </li>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                      <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                        <button 
                          className="page-link" 
                          onClick={() => paginate(number)}
                        >
                          {number}
                        </button>
                      </li>
                    ))}
                    
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next <i className="bi bi-chevron-right"></i>
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;