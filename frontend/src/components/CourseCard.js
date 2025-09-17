
import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  return (
    <div className="card h-100 shadow-sm border-0 rounded-3">
      <div className="card-header bg-primary text-white py-3">
        <h5 className="card-title mb-0 fw-bold">{course.title}</h5>
      </div>
      <div className="card-body">
        <p className="card-text text-muted mb-3">
          {course.description || 'No description available'}
        </p>
        
        <div className="mb-3">
          <span className="badge bg-secondary me-2">{course.category || 'General'}</span>
          <span className="badge bg-info">{(course.level || 'Beginner').toUpperCase()}</span>
        </div>
        
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <i className="bi bi-clock text-muted me-1"></i>
            <small className="text-muted">{course.duration || 'Self-paced'}</small>
          </div>
          <div className="h5 text-primary mb-0 fw-bold">
            {course.price === 0 || course.price === '0.00' ? 'FREE' : `$${course.price}`}
          </div>
        </div>
      </div>
      <div className="card-footer bg-transparent border-0 pt-0">
        <Link 
          to={`/courses/${course.course_id}`} 
          className="btn btn-primary w-100 py-2"
        >
          <i className="bi bi-eye me-2"></i>View Course
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;