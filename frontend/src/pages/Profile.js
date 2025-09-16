// src/pages/Profile.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfileData, updateProfileSocials } from '../services/profileService';

const Profile = () => {
  const [userData, setUserData] = useState({
    email: '',
    role: '',
    name: '',
    profile: null,
    courses: [],
    progress: null,
    socials: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingSocials, setEditingSocials] = useState(false);
  const [socialLinks, setSocialLinks] = useState({
    facebook: '',
    twitter: '',
    linkedin: '',
    youtube: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        
        const email = localStorage.getItem('userEmail') || '';
        const role = localStorage.getItem('userRole') || '';
        const userId = localStorage.getItem('userId') || '';
        
        
        const profileData = await getProfileData(role, userId);
        
        setUserData({
          email,
          role,
          name: email.split('@')[0],
          ...profileData
        });

        if (profileData.profile && profileData.profile.social_links) {
          const socials = typeof profileData.profile.social_links === 'string' 
            ? JSON.parse(profileData.profile.social_links) 
            : profileData.profile.social_links;
          setSocialLinks(socials);
        }

      } catch (err) {
        setError('Failed to load profile data. Please try again.');
        console.error('Error fetching profile:', err);
        
       
        const email = localStorage.getItem('userEmail') || '';
        const role = localStorage.getItem('userRole') || '';
        setUserData({
          email,
          role,
          name: email.split('@')[0],
          profile: null,
          courses: [],
          progress: null,
          socials: {}
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  const handleSocialsUpdate = async () => {
    try {
      await updateProfileSocials(userData.role, socialLinks);
      setUserData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          social_links: socialLinks
        }
      }));
      setEditingSocials(false);
      alert('Social links updated successfully!');
    } catch (err) {
      setError('Failed to update social links. Please try again.');
      console.error('Error updating social links:', err);
    }
  };

  const handleSocialLinkChange = (platform, value) => {
    setSocialLinks(prev => ({
      ...prev,
      [platform]: value
    }));
  };

  if (loading) {
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading profile data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h2 className="my-4">My Profile</h2>
          
          {error && (
            <div className="alert alert-warning" role="alert">
              {error}
              <br />
              <small>Showing basic profile information only.</small>
            </div>
          )}
          
          <div className="card mb-4">
            <div className="card-body">
              <div className="text-center mb-4">
                <i className="bi bi-person-circle" style={{ fontSize: '4rem' }}></i>
                <h4 className="mt-2">{userData.name}</h4>
              </div>
              
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Email</label>
                    <p>{userData.email}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Role</label>
                    <p className="text-capitalize">{userData.role}</p>
                  </div>
                </div>
              </div>

              {userData.profile && (
                <>
                  {userData.profile.bio && (
                    <div className="mb-3">
                      <label className="form-label fw-bold">Bio</label>
                      <p>{userData.profile.bio}</p>
                    </div>
                  )}
                  
                  {userData.role === 'instructor' && userData.profile.expertise && (
                    <div className="mb-3">
                      <label className="form-label fw-bold">Expertise</label>
                      <p>{userData.profile.expertise}</p>
                    </div>
                  )}
                </>
              )}

              <div className="mb-3">
                <label className="form-label fw-bold">Account Status</label>
                <p className="text-success">Active</p>
              </div>
            </div>
          </div>

         
          {userData.role === 'instructor' && (
            <div className="card mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Social Links</h5>
                <button 
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => setEditingSocials(!editingSocials)}
                >
                  {editingSocials ? 'Cancel' : 'Edit'}
                </button>
              </div>
              <div className="card-body">
                {editingSocials ? (
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Facebook</label>
                        <input
                          type="url"
                          className="form-control"
                          value={socialLinks.facebook || ''}
                          onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                          placeholder="https://facebook.com/username"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Twitter</label>
                        <input
                          type="url"
                          className="form-control"
                          value={socialLinks.twitter || ''}
                          onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                          placeholder="https://twitter.com/username"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">LinkedIn</label>
                        <input
                          type="url"
                          className="form-control"
                          value={socialLinks.linkedin || ''}
                          onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">YouTube</label>
                        <input
                          type="url"
                          className="form-control"
                          value={socialLinks.youtube || ''}
                          onChange={(e) => handleSocialLinkChange('youtube', e.target.value)}
                          placeholder="https://youtube.com/username"
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <button 
                        className="btn btn-primary"
                        onClick={handleSocialsUpdate}
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="row">
                    {socialLinks.facebook && (
                      <div className="col-md-6 mb-2">
                        <strong>Facebook:</strong> 
                        <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="ms-2">
                          {socialLinks.facebook}
                        </a>
                      </div>
                    )}
                    {socialLinks.twitter && (
                      <div className="col-md-6 mb-2">
                        <strong>Twitter:</strong> 
                        <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="ms-2">
                          {socialLinks.twitter}
                        </a>
                      </div>
                    )}
                    {socialLinks.linkedin && (
                      <div className="col-md-6 mb-2">
                        <strong>LinkedIn:</strong> 
                        <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="ms-2">
                          {socialLinks.linkedin}
                        </a>
                      </div>
                    )}
                    {socialLinks.youtube && (
                      <div className="col-md-6 mb-2">
                        <strong>YouTube:</strong> 
                        <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="ms-2">
                          {socialLinks.youtube}
                        </a>
                      </div>
                    )}
                    {!socialLinks.facebook && !socialLinks.twitter && 
                     !socialLinks.linkedin && !socialLinks.youtube && (
                      <p className="text-muted">No social links added yet.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

         
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">
                {userData.role === 'instructor' ? 'My Courses' : 'Enrolled Courses'} 
                <span className="badge bg-primary ms-2">{userData.courses?.length || 0}</span>
              </h5>
            </div>
            <div className="card-body">
              {userData.courses && userData.courses.length > 0 ? (
                <div className="list-group">
                  {userData.courses.slice(0, 5).map(course => (
                    <div key={course.course_id || course.id} className="list-group-item">
                      <h6 className="mb-1">{course.title}</h6>
                      <small className="text-muted">
                        Status: <span className="text-capitalize">{course.status || 'active'}</span>
                        {userData.role === 'student' && course.progress !== undefined && (
                          <span className="ms-3">Progress: {course.progress}%</span>
                        )}
                      </small>
                    </div>
                  ))}
                  {userData.courses.length > 5 && (
                    <div className="list-group-item text-center">
                      <small className="text-muted">
                        +{userData.courses.length - 5} more courses
                      </small>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted">
                  {userData.role === 'instructor' 
                    ? 'You haven\'t created any courses yet.' 
                    : 'You haven\'t enrolled in any courses yet.'}
                </p>
              )}
            </div>
          </div>

         
          {userData.role === 'student' && userData.progress && (
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Learning Progress</h5>
              </div>
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-md-4">
                    <div className="border rounded p-3">
                      <h3 className="text-primary">{userData.progress.enrolled_courses || 0}</h3>
                      <p className="mb-0">Enrolled Courses</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="border rounded p-3">
                      <h3 className="text-success">{userData.progress.submitted_assignments || 0}</h3>
                      <p className="mb-0">Assignments Submitted</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="border rounded p-3">
                      <h3 className="text-info">{userData.progress.quiz_attempts || 0}</h3>
                      <p className="mb-0">Quizzes Attempted</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;