
import React, { useEffect, useState } from 'react';
import { getInstructorCourses, createCourse, updateCourse, deleteCourse } from '../services/courseService';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newCourseData, setNewCourseData] = useState({
    title: '',
    description: '',
    category: '',
    language: '',
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
        
        // Reset form
        setNewCourseData({
          title: '',
          description: '',
          category: '',
          language: '',
          price: 0,
          status: 'draft',
        });

        // Close modal
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
      fetchInstructorCourses(); // Refresh the list
    } catch (err) {
      console.error('Error deleting course:', err);
      alert('Failed to delete course. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="d-flex justify-content-center my-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="my-4">Instructor Dashboard</h2>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Your Courses ({courses.length})</h4>
        <button 
          className="btn btn-success" 
          onClick={() => setShowModal(true)}
        >
          Create New Course
        </button>
      </div>

      <div className="row">
        {courses.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-info">
              <h5>No courses yet!</h5>
              <p>Create your first course to get started.</p>
            </div>
          </div>
        ) : (
          courses.map((course) => (
            <div key={course.course_id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{course.title}</h5>
                  <p className="card-text flex-grow-1">{course.description}</p>
                  
                  <div className="mt-2 mb-3">
                    <span className={`badge me-2 ${course.status === 'published' ? 'bg-success' : 'bg-secondary'}`}>
                      {course.status}
                    </span>
                    <span className="badge bg-info">{course.category}</span>
                  </div>

                  <div className="d-flex flex-wrap gap-2 mt-auto">
                    <Link to={`/courses/${course.course_id}`} className="btn btn-primary btn-sm">
                      Manage Course
                    </Link>
                    
                    <button 
                      className={`btn btn-sm ${course.status === 'draft' ? 'btn-warning' : 'btn-secondary'}`}
                      onClick={() => handleStatusToggle(course.course_id, course.status)}
                    >
                      {course.status === 'draft' ? 'Publish' : 'Unpublish'}
                    </button>
                    
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteCourse(course.course_id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Course Modal */}
      {showModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleCourseCreation}>
                <div className="modal-header">
                  <h5 className="modal-title">Create Course</h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    aria-label="Close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label htmlFor="courseTitle">Course Title</label>
                    <input
                      type="text"
                      className="form-control"
                      id="courseTitle"
                      name="title"
                      value={newCourseData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group mt-2">
                    <label htmlFor="courseDescription">Description</label>
                    <textarea
                      className="form-control"
                      id="courseDescription"
                      name="description"
                      value={newCourseData.description}
                      onChange={handleInputChange}
                      rows="3"
                      required
                    />
                  </div>
                  <div className="form-group mt-2">
                    <label htmlFor="courseCategory">Category</label>
                    <input
                      type="text"
                      className="form-control"
                      id="courseCategory"
                      name="category"
                      value={newCourseData.category}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group mt-2">
                    <label htmlFor="courseLanguage">Language</label>
                    <input
                      type="text"
                      className="form-control"
                      id="courseLanguage"
                      name="language"
                      value={newCourseData.language}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group mt-2">
                    <label htmlFor="coursePrice">Price</label>
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
                    />
                  </div>
                  <div className="form-group mt-2">
                    <label htmlFor="courseStatus">Status</label>
                    <select
                      className="form-control"
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
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success">Create Course</button>
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