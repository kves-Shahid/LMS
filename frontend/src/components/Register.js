
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  
import { registerUser } from '../services/authService';  

const Register = () => {
  const [role, setRole] = useState('student');
  const [user_name, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [f_name, setFName] = useState('');
  const [l_name, setLName] = useState('');
  const [phone_no, setPhoneNo] = useState('');
  const navigate = useNavigate();  

  const handleSubmit = async (e) => {
    e.preventDefault();  

    if (!user_name || !email || !password || !f_name || !l_name || !role) {
      alert('All fields are required!');
      return;
    }

    try {
      const response = await registerUser({ role, user_name, email, password, f_name, l_name, phone_no });
      localStorage.setItem('token', response.token);  
      navigate('/login');  // Redirect to login after successful registration
    } catch (err) {
      console.error('Registration failed:', err);
      alert('Registration failed. Please try again!');
    }
  };

  return (
    <div className="container">
      <h2 className="my-4">Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="user_name">User Name:</label>
          <input 
            type="text" 
            className="form-control" 
            id="user_name" 
            value={user_name} 
            onChange={(e) => setUserName(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group mt-2">
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
          <label htmlFor="f_name">First Name:</label>
          <input 
            type="text" 
            className="form-control" 
            id="f_name" 
            value={f_name} 
            onChange={(e) => setFName(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group mt-2">
          <label htmlFor="l_name">Last Name:</label>
          <input 
            type="text" 
            className="form-control" 
            id="l_name" 
            value={l_name} 
            onChange={(e) => setLName(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group mt-2">
          <label htmlFor="phone_no">Phone Number:</label>
          <input 
            type="text" 
            className="form-control" 
            id="phone_no" 
            value={phone_no} 
            onChange={(e) => setPhoneNo(e.target.value)} 
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
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary mt-3">Register</button>
      </form>
    </div>
  );
};

export default Register;
