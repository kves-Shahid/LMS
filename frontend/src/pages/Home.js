
import React, { useEffect, useState } from 'react';
import { getPublishedCourses } from '../services/courseService';
import CourseCard from '../components/CourseCard';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
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

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Welcome to LMS</h2>
      
      {!isAuthenticated ? (
        <div className="text-center">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Welcome to Learning Management System</h3>
              <p className="card-text">
                Please login or register to access our courses and start learning today!
              </p>
              <div className="mt-4">
                <a href="/login" className="btn btn-primary me-3">Login</a>
                <a href="/register" className="btn btn-outline-primary">Register</a>
              </div>
            </div>
          </div>
        </div>
      ) : loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading courses...</span>
          </div>
          <p className="mt-2">Loading courses...</p>
        </div>
      ) : (
        <>
          <h3 className="text-center mb-4">Available Courses</h3>
          <div className="row justify-content-center">
            {courses.length === 0 ? (
              <div className="col-12 text-center">
                <p>No courses available at the moment.</p>
              </div>
            ) : (
              courses.map((course) => (
                <div key={course.course_id} className="col-md-4 mb-4">
                  <CourseCard course={course} />
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;