// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';

const Login = () => {
  const [role, setRole] = useState('student'); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      const response = await loginUser({ role, email, password });
      localStorage.setItem('token', response.token); 
      localStorage.setItem('userRole', role); 
      localStorage.setItem('userEmail', email); 
      
      // Store user ID based on role from the response
      if (role === 'student' && response.user && response.user.student_id) {
        localStorage.setItem('student_id', response.user.student_id);
      } else if (role === 'instructor' && response.user && response.user.instructor_id) {
        localStorage.setItem('instructor_id', response.user.instructor_id);
      }
      
      
      if (role === 'student') {
        navigate('/student-dashboard');
      } else if (role === 'instructor') {
        navigate('/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login failed:', err);
      alert('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <div className="container">
      <h2 className="my-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group mt-2">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group mt-2">
          <label htmlFor="role">Role:</label>
          <select
            className="form-control"
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary mt-3">Login</button>
      </form>
    </div>
  );
};

export default Login;