import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getCourseDetails, 
  getModulesByCourse, 
  getLessonsByModule, 
  getAssignmentsByCourse,
  getQuizzesByModule,
  submitAssignment,
  submitQuiz
} from '../services/studentService';


import FloatingChatButton from '../components/FloatingChatButton';

const StudentCourseView = () => {
  const { course_id } = useParams();  
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [moduleLessons, setModuleLessons] = useState({});
  const [moduleQuizzes, setModuleQuizzes] = useState({});
  const [selectedModule, setSelectedModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('content');
  const [submissionUrls, setSubmissionUrls] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState({});

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);

       
        const courseData = await getCourseDetails(course_id);
        setCourse(courseData);

        
        const modulesData = await getModulesByCourse(course_id);
        setModules(modulesData);

        
        const assignmentsData = await getAssignmentsByCourse(course_id);
        setAssignments(assignmentsData);

        
        const lessonsPromises = modulesData.map(async (module) => {
          try {
            const lessons = await getLessonsByModule(module.module_id);
            return { moduleId: module.module_id, lessons };
          } catch (err) {
            console.error(`Failed to fetch lessons for module ${module.module_id}:`, err);
            return { moduleId: module.module_id, lessons: [] };
          }
        });

        const quizzesPromises = modulesData.map(async (module) => {
          try {
            const quizzes = await getQuizzesByModule(module.module_id);
            return { moduleId: module.module_id, quizzes };
          } catch (err) {
            console.error(`Failed to fetch quizzes for module ${module.module_id}:`, err);
            return { moduleId: module.module_id, quizzes: [] };
          }
        });

        const [lessonsResults, quizzesResults] = await Promise.all([
          Promise.all(lessonsPromises),
          Promise.all(quizzesPromises)
        ]);

        const lessonsMap = {};
        lessonsResults.forEach(result => {
          lessonsMap[result.moduleId] = result.lessons;
        });
        setModuleLessons(lessonsMap);

        const quizzesMap = {};
        quizzesResults.forEach(result => {
          quizzesMap[result.moduleId] = result.quizzes;
        });
        setModuleQuizzes(quizzesMap);

      
        const initialUrls = {};
        const initialStatus = {};
        assignmentsData.forEach(assignment => {
          initialUrls[assignment.assignment_id] = '';
          initialStatus[assignment.assignment_id] = { loading: false, error: null, success: false };
        });
        setSubmissionUrls(initialUrls);
        setSubmissionStatus(initialStatus);

      } catch (err) {
        console.error('Error fetching course data:', err);
        alert('Failed to load course data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (course_id) {
      fetchCourseData();
    }
  }, [course_id]);

  const handleAssignmentSubmit = async (assignmentId) => {
    try {
      setSubmissionStatus(prev => ({
        ...prev,
        [assignmentId]: { loading: true, error: null, success: false }
      }));

      const studentId = localStorage.getItem('userId') || localStorage.getItem('student_id');
      const content = submissionUrls[assignmentId];

      if (!content) {
        setSubmissionStatus(prev => ({
          ...prev,
          [assignmentId]: { loading: false, error: 'Please enter a submission URL', success: false }
        }));
        return;
      }

      if (!studentId) {
        setSubmissionStatus(prev => ({
          ...prev,
          [assignmentId]: { loading: false, error: 'Student ID not found. Please log in again.', success: false }
        }));
        return;
      }

     
      await submitAssignment({
        assignment_id: assignmentId,
        student_id: parseInt(studentId),
        content_url: content
      });

      setSubmissionStatus(prev => ({
        ...prev,
        [assignmentId]: { loading: false, error: null, success: true }
      }));

      setSubmissionUrls(prev => ({
        ...prev,
        [assignmentId]: ''
      }));

      setTimeout(() => {
        setSubmissionStatus(prev => ({
          ...prev,
          [assignmentId]: { loading: false, error: null, success: false }
        }));
      }, 3000);

    } catch (err) {
      console.error('Error submitting assignment:', err);

      let errorMessage = 'Failed to submit assignment. Please try again.';
      if (err.response?.status === 400) {
        errorMessage = 'Invalid submission data or already submitted.';
      } else if (err.response?.status === 403) {
        errorMessage = 'You are not enrolled in this course.';
      } else if (err.response?.status === 404) {
        errorMessage = 'Assignment not found.';
      }

      setSubmissionStatus(prev => ({
        ...prev,
        [assignmentId]: { loading: false, error: errorMessage, success: false }
      }));
    }
  };

  const handleQuizSubmit = async (quizId) => {
    try {
      const studentId = localStorage.getItem('userId') || localStorage.getItem('student_id');

      if (!studentId) {
        alert('Student ID not found. Please log in again.');
        return;
      }

      // For demo purposes - in real app, you'd collect actual answers
      await submitQuiz({
        quiz_id: quizId,
        student_id: parseInt(studentId),
        score: 0, // This would be calculated based on answers
        attempt_no: 1
      });

      alert('Quiz submitted successfully!');
    } catch (err) {
      console.error('Error submitting quiz:', err);
      alert('Failed to submit quiz. Please try again.');
    }
  };

  const handleUrlChange = (assignmentId, url) => {
    setSubmissionUrls(prev => ({
      ...prev,
      [assignmentId]: url
    }));

    // Clear any previous error when user starts typing
    if (submissionStatus[assignmentId]?.error) {
      setSubmissionStatus(prev => ({
        ...prev,
        [assignmentId]: { ...prev[assignmentId], error: null }
      }));
    }
  };

  const handleReviewClick = () => {
    // Navigate to the submit-review page using course_id
    navigate(`/courses/${course_id}/review`);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="d-flex justify-content-center my-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container">
        <div className="alert alert-danger my-4">Course not found or you don't have access to this course.</div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Floating Review Button */}
      <button 
        className="btn btn-primary rounded-pill p-3"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
        }}
        onClick={handleReviewClick}
        title="Submit a review for this course"
      >
        ✍️ Review
      </button>

      {/* Floating Chat Button */}
      <FloatingChatButton course_id={course_id} />

      {/* Course Header */}
      <div className="card mb-4">
        <div className="card-body">
          <h1 className="card-title">{course.title}</h1>
          <p className="card-text">{course.description}</p>
          <div className="d-flex gap-2 flex-wrap">
            <span className="badge bg-primary">{course.category}</span>
            <span className="badge bg-secondary">{course.language}</span>
            <span className="badge bg-success">Enrolled</span>
            {course.price > 0 && <span className="badge bg-warning">${course.price}</span>}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="nav nav-tabs mb-4">
        <button 
          className={`nav-link ${activeTab === 'content' ? 'active' : ''}`}
          onClick={() => setActiveTab('content')}
        >
          📚 Course Content
        </button>
        <button 
          className={`nav-link ${activeTab === 'assignments' ? 'active' : ''}`}
          onClick={() => setActiveTab('assignments')}
        >
          📝 Assignments
        </button>
      </nav>

      {/* Course Content Tab */}
      {activeTab === 'content' && (
        <div className="row">
          <div className="col-md-3">
            {/* Module Navigation */}
            <div className="card">
              <div className="card-header">
                <h5>Course Modules</h5>
              </div>
              <div className="list-group list-group-flush">
                {modules.map((module) => (
                  <button
                    key={module.module_id}
                    className={`list-group-item list-group-item-action ${selectedModule?.module_id === module.module_id ? 'active' : ''}`}
                    onClick={() => setSelectedModule(module)}
                  >
                    <strong>{module.position}.</strong> {module.title}
                    <br />
                    <small className="text-muted">
                      {moduleLessons[module.module_id]?.length || 0} lessons •{' '}
                      {moduleQuizzes[module.module_id]?.length || 0} quizzes
                    </small>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="col-md-9">
            {/* Module Content */}
            {selectedModule ? (
              <div className="card">
                <div className="card-header bg-light">
                  <h4 className="mb-0">
                    <strong>{selectedModule.position}.</strong> {selectedModule.title}
                  </h4>
                  <p className="mb-0 text-muted">{selectedModule.description}</p>
                </div>
                <div className="card-body">
                  {/* Lessons */}
                  {moduleLessons[selectedModule.module_id] && moduleLessons[selectedModule.module_id].length > 0 && (
                    <div className="mb-4">
                      <h5>📖 Lessons</h5>
                      <div className="list-group">
                        {moduleLessons[selectedModule.module_id].map((lesson) => (
                          <div key={lesson.lesson_id} className="list-group-item">
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <h6 className="mb-1">
                                  <strong>{lesson.position}.</strong> {lesson.title}
                                </h6>
                                {lesson.description && (
                                  <p className="mb-1 text-muted">{lesson.description}</p>
                                )}
                              </div>
                            </div>
                            
                            {lesson.video_url && (
                              <div className="mt-3">
                                <div className="ratio ratio-16x9">
                                  <video controls className="w-100 rounded">
                                    <source src={lesson.video_url} type="video/mp4" />
                                    Your browser does not support the video tag.
                                  </video>
                                </div>
                              </div>
                            )}
                            
                            {lesson.resource && (
                              <div className="mt-2">
                                <a 
                                  href={lesson.resource} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="btn btn-sm btn-outline-primary"
                                >
                                  📄 Download Resource
                                </a>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quizzes */}
                  {moduleQuizzes[selectedModule.module_id] && moduleQuizzes[selectedModule.module_id].length > 0 && (
                    <div>
                      <h5>🧠 Quizzes</h5>
                      <div className="list-group">
                        {moduleQuizzes[selectedModule.module_id].map((quiz) => (
                          <div key={quiz.quiz_id} className="list-group-item">
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <h6 className="mb-1">{quiz.title}</h6>
                                <p className="mb-1 text-muted">
                                  📊 Total Marks: {quiz.total_marks} | ⏰ Time Limit: {quiz.time_limit} minutes
                                </p>
                              </div>
                              <button 
                                className="btn btn-primary btn-sm"
                                onClick={() => handleQuizSubmit(quiz.quiz_id)}
                              >
                                Take Quiz
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(!moduleLessons[selectedModule.module_id]?.length && !moduleQuizzes[selectedModule.module_id]?.length) && (
                    <div className="alert alert-info">
                      No content available for this module yet.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="alert alert-info">
                👈 Select a module from the sidebar to view its content.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Assignments Tab */}
      {activeTab === 'assignments' && (
        <div className="card">
          <div className="card-header">
            <h4>📝 Course Assignments</h4>
          </div>
          <div className="card-body">
            {assignments.length === 0 ? (
              <div className="alert alert-info">
                No assignments available for this course yet.
              </div>
            ) : (
              <div className="row">
                {assignments.map((assignment) => {
                  const status = submissionStatus[assignment.assignment_id] || { loading: false, error: null, success: false };
                  
                  return (
                    <div key={assignment.assignment_id} className="col-md-6 mb-4">
                      <div className="card h-100">
                        <div className="card-header">
                          <h5 className="card-title mb-0">{assignment.title}</h5>
                        </div>
                        <div className="card-body">
                          <p className="card-text">{assignment.description}</p>
                          
                          <div className="mb-3">
                            <strong>📅 Due Date:</strong>{' '}
                            {new Date(assignment.due_date).toLocaleDateString()}
                            <br />
                            <strong>🏆 Max Score:</strong> {assignment.max_score || 'N/A'}
                          </div>
                          
                          <div className="mb-3">
                            <label htmlFor={`assignment-${assignment.assignment_id}`} className="form-label">
                              Submission URL:
                            </label>
                            <input 
                              type="url" 
                              className="form-control"
                              id={`assignment-${assignment.assignment_id}`}
                              placeholder="https://your-submission-link.com"
                              value={submissionUrls[assignment.assignment_id] || ''}
                              onChange={(e) => handleUrlChange(assignment.assignment_id, e.target.value)}
                              disabled={status.loading}
                            />
                          </div>
                          
                          {/* Status messages */}
                          {status.error && (
                            <div className="alert alert-danger mb-3 py-2">
                              <small>{status.error}</small>
                            </div>
                          )}
                          
                          {status.success && (
                            <div className="alert alert-success mb-3 py-2">
                              <small>✅ Assignment submitted successfully!</small>
                            </div>
                          )}
                          

                          <button 
                            className="btn btn-success w-100"
                            onClick={() => handleAssignmentSubmit(assignment.assignment_id)}
                            disabled={status.loading}
                          >
                            {status.loading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Submitting...
                              </>
                            ) : (
                              '📤 Submit Assignment'
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentCourseView;