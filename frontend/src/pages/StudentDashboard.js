
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { getPublishedCourses } from '../services/courseService';
import { enrollStudent, getStudentCourses } from '../services/enrollmentService';

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      }
    } catch (err) {
      console.error('Enrollment error:', err);
      alert('Failed to enroll in the course. ' + (err.response?.data?.msg || 'Please try again.'));
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

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-danger my-4">{error}</div>
      </div>
    );
  }

  const availableForEnrollment = courses.filter(course => 
    !enrolledCourses.some(enrolled => enrolled.course_id === course.course_id)
  );

  return (
    <div className="container">
      <h2 className="my-4">Student Dashboard</h2>

      <h4>Your Enrolled Courses</h4>
      {enrolledCourses.length === 0 ? (
        <p>You have not enrolled in any courses yet.</p>
      ) : (
        <div className="row mb-4">
          {enrolledCourses.map((course) => (
            <div key={course.course_id} className="col-md-6 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{course.title}</h5>
                  <p className="card-text">{course.description}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="badge bg-success">Enrolled</span>
                    <Link 
                      to={`/student/course/${course.course_id}`} 
                      className="btn btn-primary btn-sm"
                    >
                      Access Course
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <h4>Available Courses</h4>
      {availableForEnrollment.length === 0 ? (
        <p>No courses available for enrollment.</p>
      ) : (
        <div className="row">
          {availableForEnrollment.map((course) => (
            <div key={course.course_id} className="col-md-6 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{course.title}</h5>
                  <p className="card-text">{course.description}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">By: Instructor {course.instructor_id}</span>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleEnroll(course.course_id)}
                    >
                      Enroll Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;