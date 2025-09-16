
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    const email = localStorage.getItem('userEmail');
    
    if (token) {
      setIsAuthenticated(true);
      setUserRole(role || '');
      setUserEmail(email || '');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('student_id');
    localStorage.removeItem('instructor_id');
    setIsAuthenticated(false);
    setUserRole('');
    setUserEmail('');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">LMS</Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>

            {!isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            ) : (
              <>
                {userRole === 'student' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/student-dashboard">Dashboard</Link>
                  </li>
                )}
                {userRole === 'instructor' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/dashboard">Dashboard</Link>
                  </li>
                )}
              </>
            )}
          </ul>

          {isAuthenticated && (
            <ul className="navbar-nav">
              <li className="nav-item dropdown">
                <button 
                  className="nav-link dropdown-toggle btn btn-link text-decoration-none" 
                  id="navbarDropdown" 
                  type="button" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                  style={{ border: 'none', background: 'none' }}
                >
                  <i className="bi bi-person-circle me-1"></i>
                  {userEmail || 'Profile'}
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      <i className="bi bi-person me-2"></i>My Profile
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>Logout
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;