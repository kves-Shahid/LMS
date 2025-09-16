import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './pages/Dashboard';
import StudentDashboard from './pages/StudentDashboard';
import StudentCourseView from './pages/StudentCourseView';
import CourseDetails from './pages/CourseDetails';
import CourseStats from './pages/CourseStats';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';

import SubmitReview from './components/SubmitReview';
import ReviewsList from './components/ReviewsList';

import ChatPage from './pages/ChatPage';

const App = () => {
  return (
    <div>
      <Header />
      
      <div className="container mt-4">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['instructor']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/student-dashboard" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/student/course/:course_id" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentCourseView />
            </ProtectedRoute>
          } />
          
          <Route path="/courses/:course_id" element={
            <ProtectedRoute allowedRoles={['instructor']}>
              <CourseDetails />
            </ProtectedRoute>
          } />
          
          
          <Route path="/courses/:course_id/stats" element={
            <ProtectedRoute allowedRoles={['instructor']}>
              <CourseStats />
            </ProtectedRoute>
          } />
          
         
          <Route path="/courses/:course_id/review" element={
            <ProtectedRoute allowedRoles={['student']}>
              <SubmitReview />
            </ProtectedRoute>
          } />
          
          <Route path="/courses/:course_id/reviews" element={
            <ProtectedRoute allowedRoles={['student', 'instructor']}>
              <ReviewsList />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
         
          <Route path="/chat/:course_id" element={<ChatPage />} /> 
        </Routes>
      </div>
      
      <Footer />
    </div>
  );
};

export default App;
