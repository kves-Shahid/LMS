import React, { useEffect, useState } from 'react';
import { getPublishedCourses } from '../services/courseService';
import CourseCard from '../components/CourseCard';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(6); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    
    if (token) {
      fetchCourses();
    }
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await getPublishedCourses();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

 
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(courses.length / coursesPerPage);

  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container py-5">
      {!isAuthenticated ? (
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            <div className="card shadow-lg border-0 rounded-3">
              <div className="card-body text-center p-5">
                <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-4" 
                     style={{ width: '80px', height: '80px' }}>
                  <i className="bi bi-book-half text-white fs-2"></i>
                </div>
                <h2 className="card-title fw-bold text-dark mb-3">Welcome to Learning Management System</h2>
                <p className="card-text text-muted fs-5 mb-4">
                  Access our premium courses and start your learning journey today!
                </p>
                <div className="mt-4">
                  <a href="/login" className="btn btn-primary btn-lg me-3 px-4 py-2">
                    <i className="bi bi-box-arrow-in-right me-2"></i>Login
                  </a>
                  <a href="/register" className="btn btn-outline-primary btn-lg px-4 py-2">
                    <i className="bi bi-person-plus me-2"></i>Register
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading courses...</span>
          </div>
          <p className="mt-3 text-muted fs-5">Loading available courses...</p>
        </div>
      ) : (
        <>
          <div className="text-center mb-5">
            <h2 className="fw-bold text-dark mb-3">Available Courses</h2>
            <p className="text-muted fs-5">Explore our curated collection of learning materials</p>
          </div>
          
          <div className="row">
            {currentCourses.length === 0 ? (
              <div className="col-12 text-center py-4">
                <div className="bg-light rounded-3 p-5">
                  <i className="bi bi-inbox display-4 text-muted mb-3"></i>
                  <h4 className="text-muted">No courses available</h4>
                  <p className="text-muted">Check back later for new course offerings.</p>
                </div>
              </div>
            ) : (
              currentCourses.map((course) => (
                <div key={course.course_id} className="col-xl-4 col-lg-4 col-md-6 mb-4">
                  <CourseCard course={course} />
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {courses.length > coursesPerPage && (
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
  );
};

export default Home;