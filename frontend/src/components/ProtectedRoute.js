
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  
  // If not authenticated, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // If role is specified but user doesn't have it, redirect to appropriate dashboard
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect based on user's actual role
    if (userRole === 'student') {
      return <Navigate to="/student-dashboard" replace />;
    } else if (userRole === 'instructor') {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }
  
  return children;
};

export default ProtectedRoute;