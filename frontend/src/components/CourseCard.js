// src/components/CourseCard.js
import React from 'react';
import { Link } from 'react-router-dom';  

const CourseCard = ({ course }) => {
  return (
    <div className="col-md-4 mb-4">
      <div className="card">
        <img src="https://via.placeholder.com/150" className="card-img-top" alt={course.title} />
        <div className="card-body">
          <h5 className="card-title">{course.title}</h5>
          <p className="card-text">{course.description}</p>
          <p className="card-text">Price: ${course.price}</p>
          <Link to={`/courses/${course.course_id}`} className="btn btn-primary">View Course</Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
