import React, { useEffect, useState } from 'react';
import { getInstructorCourses, createCourse, updateCourse, deleteCourse } from '../services/courseService';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(6); 
  const [newCourseData, setNewCourseData] = useState({
    title: '',
    description: '',
    category: '',
    language: 'English',
    price: 0,
    status: 'draft',
  });

  useEffect(() => {
    fetchInstructorCourses();
  }, []);

  const fetchInstructorCourses = async () => {
    try {
      setLoading(true);
      const data = await getInstructorCourses();
      setCourses(data || []);
    } catch (err) {
      console.error('Error fetching courses:', err);
      alert('Failed to load courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(courses.length / coursesPerPage);


  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourseData((prevData) => ({
      ...prevData,
      [name]: name === 'price' ? Number(value) : value,
    }));
  };

  const handleCourseCreation = async (e) => {
    e.preventDefault();
    try {
      const response = await createCourse(newCourseData);

      if (response && response.courses) {
        setCourses(response.courses);
        alert('Course created successfully!');
        
    
        setNewCourseData({
          title: '',
          description: '',
          category: '',
          language: 'English',
          price: 0,
          status: 'draft',
        });


        setShowModal(false);
      } else {
        alert('Failed to create course. Please try again.');
      }
    } catch (err) {
      console.error('Error creating course:', err);
      alert(err.message || 'Failed to create course. Please try again.');
    }
  };

  const handleStatusToggle = async (courseId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'draft' ? 'published' : 'draft';
      await updateCourse(courseId, { status: newStatus });
      alert(`Course ${newStatus === 'published' ? 'published' : 'unpublished'} successfully!`);
      fetchInstructorCourses(); // Refresh the list
    } catch (err) {
      console.error('Error updating course status:', err);
      alert('Failed to update course status. Please try again.');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteCourse(courseId);
      alert('Course deleted successfully!');
      fetchInstructorCourses(); 
    } catch (err) {
      console.error('Error deleting course:', err);
      alert('Failed to delete course. Please try again.');
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
        <p className="text-center text-muted">Loading your courses...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Instructor Dashboard</h2>
          <p className="text-muted">Manage your courses and track your progress</p>
        </div>
        <button 
          className="btn btn-primary btn-lg d-flex align-items-center"
          onClick={() => setShowModal(true)}
        >
          <i className="bi bi-plus-circle me-2"></i>Create New Course
        </button>
      </div>

      {/* Stats Card */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h6 className="card-title">Total Courses</h6>
                  <h3 className="card-text fw-bold">{courses.length}</h3>
                </div>
                <i className="bi bi-journal-bookmark fs-1 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h6 className="card-title">Published</h6>
                  <h3 className="card-text fw-bold">
                    {courses.filter(course => course.status === 'published').length}
                  </h3>
                </div>
                <i className="bi bi-check-circle fs-1 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h6 className="card-title">Drafts</h6>
                  <h3 className="card-text fw-bold">
                    {courses.filter(course => course.status === 'draft').length}
                  </h3>
                </div>
                <i className="bi bi-pencil-square fs-1 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <h5 className="card-title mb-0 fw-bold">Your Courses</h5>
        </div>
        <div className="card-body">
          {courses.length === 0 ? (
            <div className="text-center py-5">
              <div className="bg-light rounded-3 p-5">
                <i className="bi bi-journal-plus display-4 text-muted mb-3"></i>
                <h4 className="text-muted">No courses yet!</h4>
                <p className="text-muted mb-4">Create your first course to get started.</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowModal(true)}
                >
                  <i className="bi bi-plus-circle me-2"></i>Create Your First Course
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="row">
                {currentCourses.map((course) => (
                  <div key={course.course_id} className="col-xl-4 col-lg-6 col-md-6 mb-4">
                    <div className="card h-100 shadow-sm border-0 rounded-3">
                      <div className={`card-header ${course.status === 'published' ? 'bg-success' : 'bg-secondary'} text-white py-3`}>
                        <h6 className="card-title mb-0 fw-bold">{course.title}</h6>
                      </div>
                      <div className="card-body d-flex flex-column">
                        <p className="card-text text-muted mb-3 flex-grow-1">
                          {course.description || 'No description available'}
                        </p>
                        
                        <div className="mb-3">
                          <span className={`badge ${course.status === 'published' ? 'bg-success' : 'bg-secondary'} me-2`}>
                            <i className={`bi ${course.status === 'published' ? 'bi-check-circle' : 'bi-pencil-square'} me-1`}></i>
                            {course.status}
                          </span>
                          <span className="badge bg-info">{course.category || 'Uncategorized'}</span>
                        </div>

                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="badge bg-light text-dark">
                            <i className="bi bi-translate me-1"></i>{course.language || 'English'}
                          </span>
                          <span className="h6 text-primary mb-0 fw-bold">
                            ${course.price || '0.00'}
                          </span>
                        </div>

                        <div className="d-grid gap-2">
                          <Link 
                            to={`/courses/${course.course_id}`} 
                            className="btn btn-outline-primary btn-sm"
                          >
                            <i className="bi bi-gear me-2"></i>Manage Course
                          </Link>
                          
                          <div className="d-flex gap-2">
                            <button 
                              className={`btn btn-sm flex-fill ${course.status === 'draft' ? 'btn-warning' : 'btn-outline-secondary'}`}
                              onClick={() => handleStatusToggle(course.course_id, course.status)}
                            >
                              <i className={`bi ${course.status === 'draft' ? 'bi-megaphone' : 'bi-eye-slash'} me-1`}></i>
                              {course.status === 'draft' ? 'Publish' : 'Unpublish'}
                            </button>
                            
                            <button 
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleDeleteCourse(course.course_id)}
                            >
                              <i className="bi bi-trash"></i>
                              <span className="visually-hidden">Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {courses.length > coursesPerPage && (
                <nav className="d-flex justify-content-center mt-4">
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

      {/* Create Course Modal */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <form onSubmit={handleCourseCreation}>
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title">
                    <i className="bi bi-plus-circle me-2"></i>Create New Course
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close btn-close-white" 
                    aria-label="Close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label htmlFor="courseTitle" className="form-label fw-semibold">Course Title *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="courseTitle"
                          name="title"
                          value={newCourseData.title}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter course title"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label htmlFor="courseCategory" className="form-label fw-semibold">Category *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="courseCategory"
                          name="category"
                          value={newCourseData.category}
                          onChange={handleInputChange}
                          required
                          placeholder="e.g., Programming, Design, Business"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="courseDescription" className="form-label fw-semibold">Description *</label>
                    <textarea
                      className="form-control"
                      id="courseDescription"
                      name="description"
                      value={newCourseData.description}
                      onChange={handleInputChange}
                      rows="4"
                      required
                      placeholder="Describe what students will learn in this course"
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-4">
                      <div className="form-group mb-3">
                        <label htmlFor="courseLanguage" className="form-label fw-semibold">Language *</label>
                        <select
                          className="form-select"
                          id="courseLanguage"
                          name="language"
                          value={newCourseData.language}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="English">English</option>
                          <option value="Spanish">Spanish</option>
                          <option value="French">French</option>
                          <option value="German">German</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group mb-3">
                        <label htmlFor="coursePrice" className="form-label fw-semibold">Price ($) *</label>
                        <input
                          type="number"
                          className="form-control"
                          id="coursePrice"
                          name="price"
                          value={newCourseData.price}
                          onChange={handleInputChange}
                          min="0"
                          step="0.01"
                          required
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group mb-3">
                        <label htmlFor="courseStatus" className="form-label fw-semibold">Status *</label>
                        <select
                          className="form-select"
                          id="courseStatus"
                          name="status"
                          value={newCourseData.status}
                          onChange={handleInputChange}
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary" 
                    onClick={() => setShowModal(false)}
                  >
                    <i className="bi bi-x-circle me-2"></i>Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <i className="bi bi-check-circle me-2"></i>Create Course
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;