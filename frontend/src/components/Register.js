import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';  
import { registerUser } from '../services/authService';  

const Register = () => {
  const [role, setRole] = useState('student');
  const [user_name, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [f_name, setFName] = useState('');
  const [l_name, setLName] = useState('');
  const [phone_no, setPhoneNo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();  

  const handleSubmit = async (e) => {
    e.preventDefault();  

    if (!user_name || !email || !password || !f_name || !l_name || !role) {
      alert('All fields are required!');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await registerUser({ role, user_name, email, password, f_name, l_name, phone_no });
      localStorage.setItem('token', response.token);  
      navigate('/login'); 
    } catch (err) {
      console.error('Registration failed:', err);
      alert('Registration failed. Please try again!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-lg border-0 rounded-3">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{ width: '60px', height: '60px' }}>
                    <i className="bi bi-person-plus text-white fs-3"></i>
                  </div>
                  <h2 className="fw-bold text-dark">Create Your Account</h2>
                  <p className="text-muted">Join our learning community today</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label htmlFor="f_name" className="form-label fw-semibold">First Name *</label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">
                            <i className="bi bi-person text-muted"></i>
                          </span>
                          <input 
                            type="text" 
                            className="form-control border-start-0" 
                            id="f_name" 
                            value={f_name} 
                            onChange={(e) => setFName(e.target.value)} 
                            required 
                            placeholder="Enter your first name"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label htmlFor="l_name" className="form-label fw-semibold">Last Name *</label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">
                            <i className="bi bi-person text-muted"></i>
                          </span>
                          <input 
                            type="text" 
                            className="form-control border-start-0" 
                            id="l_name" 
                            value={l_name} 
                            onChange={(e) => setLName(e.target.value)} 
                            required 
                            placeholder="Enter your last name"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="user_name" className="form-label fw-semibold">Username *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-at text-muted"></i>
                      </span>
                      <input 
                        type="text" 
                        className="form-control border-start-0" 
                        id="user_name" 
                        value={user_name} 
                        onChange={(e) => setUserName(e.target.value)} 
                        required 
                        placeholder="Choose a username"
                      />
                    </div>
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="email" className="form-label fw-semibold">Email Address *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-envelope text-muted"></i>
                      </span>
                      <input 
                        type="email" 
                        className="form-control border-start-0" 
                        id="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="password" className="form-label fw-semibold">Password *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-lock text-muted"></i>
                      </span>
                      <input 
                        type="password" 
                        className="form-control border-start-0" 
                        id="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        placeholder="Create a strong password"
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label htmlFor="phone_no" className="form-label fw-semibold">Phone Number</label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">
                            <i className="bi bi-telephone text-muted"></i>
                          </span>
                          <input 
                            type="text" 
                            className="form-control border-start-0" 
                            id="phone_no" 
                            value={phone_no} 
                            onChange={(e) => setPhoneNo(e.target.value)} 
                            placeholder="Optional phone number"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label htmlFor="role" className="form-label fw-semibold">Role *</label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">
                            <i className="bi bi-person-badge text-muted"></i>
                          </span>
                          <select 
                            className="form-select border-start-0" 
                            id="role" 
                            value={role} 
                            onChange={(e) => setRole(e.target.value)} 
                          >
                            <option value="student">Student</option>
                            <option value="instructor">Instructor</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="d-grid mb-3">
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg fw-semibold py-2"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-person-plus me-2"></i>
                          Create Account
                        </>
                      )}
                    </button>
                  </div>

                  <div className="text-center">
                    <p className="text-muted mb-0">
                      Already have an account?{' '}
                      <Link to="/login" className="text-primary text-decoration-none fw-semibold">
                        Sign in here
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>

            <div className="text-center mt-4">
              <small className="text-muted">
                By creating an account, you agree to our Terms of Service and Privacy Policy
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;