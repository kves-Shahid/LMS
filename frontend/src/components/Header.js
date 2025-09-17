import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';


export const triggerAuthUpdate = () => {
  window.dispatchEvent(new Event('authStateChange'));
};

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('userRole');
      const email = localStorage.getItem('userEmail');
      
      if (token) {
        setIsAuthenticated(true);
        setUserRole(role || '');
        setUserEmail(email || '');
      } else {
        setIsAuthenticated(false);
        setUserRole('');
        setUserEmail('');
      }
    };

   
    checkAuthStatus();

    
    const handleAuthChange = () => {
      checkAuthStatus();
    };

    
    window.addEventListener('authStateChange', handleAuthChange);
    
   
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('authStateChange', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
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
    
  
    triggerAuthUpdate();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold d-flex align-items-center text-white" to="/">
          <i className="bi bi-book-half me-2"></i>
          LMS Platform
        </Link>
        
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
            {!isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/login">
                    <i className="bi bi-box-arrow-in-right me-1"></i>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/register">
                    <i className="bi bi-person-plus me-1"></i>
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                {userRole === 'student' && (
                  <li className="nav-item">
                    <Link className="nav-link text-white" to="/student-dashboard">
                      <i className="bi bi-speedometer2 me-1"></i>
                      Dashboard
                    </Link>
                  </li>
                )}
                {userRole === 'instructor' && (
                  <li className="nav-item">
                    <Link className="nav-link text-white" to="/dashboard">
                      <i className="bi bi-speedometer2 me-1"></i>
                      Dashboard
                    </Link>
                  </li>
                )}
              </>
            )}
          </ul>

          {isAuthenticated && (
            <div className="d-flex align-items-center">
              <ul className="navbar-nav">
                <li className="nav-item dropdown">
                  <button 
                    className="nav-link dropdown-toggle d-flex align-items-center bg-transparent border-0 text-white" 
                    id="navbarDropdown" 
                    type="button" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"
                    style={{ background: 'none' }}
                  >
                    <div className="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '32px', height: '32px' }}>
                      <i className="bi bi-person-fill"></i>
                    </div>
                    <span className="d-none d-md-inline">{userEmail || 'Profile'}</span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow" aria-labelledby="navbarDropdown">
                    <li>
                      <h6 className="dropdown-header text-capitalize">{userRole} Account</h6>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        <i className="bi bi-person me-2"></i>My Profile
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-2"></i>Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;