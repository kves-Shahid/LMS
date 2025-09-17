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

      await submitQuiz({
        quiz_id: quizId,
        student_id: parseInt(studentId),
        score: 0,
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

    if (submissionStatus[assignmentId]?.error) {
      setSubmissionStatus(prev => ({
        ...prev,
        [assignmentId]: { ...prev[assignmentId], error: null }
      }));
    }
  };

  const handleReviewClick = () => {
    navigate(`/courses/${course_id}/review`);
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        <p className="text-center text-muted">Loading course content...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger text-center my-4">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Course not found or you don't have access to this course.
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Floating Chat Button */}
      <FloatingChatButton course_id={course_id} />

      {/* Course Header */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h1 className="card-title fw-bold text-dark mb-2">{course.title}</h1>
              <p className="card-text text-muted fs-5">{course.description}</p>
            </div>
            <button 
              className="btn btn-primary d-flex align-items-center"
              onClick={handleReviewClick}
            >
              <i className="bi bi-star me-2"></i>Write Review
            </button>
          </div>
          
          <div className="d-flex gap-2 flex-wrap">
            <span className="badge bg-primary">
              <i className="bi bi-tag me-1"></i>{course.category}
            </span>
            <span className="badge bg-secondary">
              <i className="bi bi-translate me-1"></i>{course.language}
            </span>
            <span className="badge bg-success">
              <i className="bi bi-check-circle me-1"></i>Enrolled
            </span>
            {course.price > 0 && (
              <span className="badge bg-warning">
                <i className="bi bi-currency-dollar me-1"></i>${course.price}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="nav nav-pills nav-fill mb-4">
        <button 
          className={`nav-link ${activeTab === 'content' ? 'active' : ''} d-flex align-items-center`}
          onClick={() => setActiveTab('content')}
        >
          <i className="bi bi-journal-bookmark me-2"></i>
          Course Content
        </button>
        <button 
          className={`nav-link ${activeTab === 'assignments' ? 'active' : ''} d-flex align-items-center`}
          onClick={() => setActiveTab('assignments')}
        >
          <i className="bi bi-clipboard-check me-2"></i>
          Assignments
        </button>
      </nav>

      {/* Course Content Tab */}
      {activeTab === 'content' && (
        <div className="row">
          <div className="col-lg-3">
            {/* Module Navigation */}
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-light">
                <h5 className="card-title mb-0 fw-semibold">
                  <i className="bi bi-list-check me-2"></i>
                  Course Modules
                </h5>
              </div>
              <div className="list-group list-group-flush">
                {modules.map((module) => (
                  <button
                    key={module.module_id}
                    className={`list-group-item list-group-item-action d-flex justify-content-between align-items-start ${
                      selectedModule?.module_id === module.module_id ? 'active' : ''
                    }`}
                    onClick={() => setSelectedModule(module)}
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw-semibold">
                        {module.position}. {module.title}
                      </div>
                      <small className="text-muted">
                        {moduleLessons[module.module_id]?.length || 0} lessons •{' '}
                        {moduleQuizzes[module.module_id]?.length || 0} quizzes
                      </small>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-9">
            {/* Module Content */}
            {selectedModule ? (
              <div className="card shadow-sm border-0">
                <div className="card-header bg-light">
                  <h4 className="mb-0 fw-semibold">
                    <span className="badge bg-primary me-2">{selectedModule.position}</span>
                    {selectedModule.title}
                  </h4>
                  <p className="mb-0 text-muted">{selectedModule.description}</p>
                </div>
                <div className="card-body">
                  {/* Lessons */}
                  {moduleLessons[selectedModule.module_id] && moduleLessons[selectedModule.module_id].length > 0 && (
                    <div className="mb-4">
                      <h5 className="fw-semibold text-primary mb-3">
                        <i className="bi bi-book me-2"></i>
                        Lessons
                      </h5>
                      <div className="row">
                        {moduleLessons[selectedModule.module_id].map((lesson) => (
                          <div key={lesson.lesson_id} className="col-md-6 mb-3">
                            <div className="card border-0 shadow-sm h-100">
                              <div className="card-body">
                                <h6 className="card-title fw-semibold">
                                  <span className="badge bg-secondary me-2">{lesson.position}</span>
                                  {lesson.title}
                                </h6>
                                {lesson.description && (
                                  <p className="card-text text-muted small">{lesson.description}</p>
                                )}
                                
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
                                  <div className="mt-3">
                                    <a 
                                      href={lesson.resource} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="btn btn-outline-primary btn-sm"
                                    >
                                      <i className="bi bi-download me-1"></i>Download Resource
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quizzes */}
                  {moduleQuizzes[selectedModule.module_id] && moduleQuizzes[selectedModule.module_id].length > 0 && (
                    <div>
                      <h5 className="fw-semibold text-info mb-3">
                        <i className="bi bi-question-circle me-2"></i>
                        Quizzes
                      </h5>
                      <div className="row">
                        {moduleQuizzes[selectedModule.module_id].map((quiz) => (
                          <div key={quiz.quiz_id} className="col-md-6 mb-3">
                            <div className="card border-0 shadow-sm h-100">
                              <div className="card-body">
                                <h6 className="card-title fw-semibold">{quiz.title}</h6>
                                <div className="d-flex justify-content-between text-muted small mb-3">
                                  <span><i className="bi bi-star me-1"></i>{quiz.total_marks} marks</span>
                                  <span><i className="bi bi-clock me-1"></i>{quiz.time_limit} mins</span>
                                </div>
                                <button 
                                  className="btn btn-primary btn-sm w-100"
                                  onClick={() => handleQuizSubmit(quiz.quiz_id)}
                                >
                                  <i className="bi bi-play-circle me-1"></i>Take Quiz
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(!moduleLessons[selectedModule.module_id]?.length && !moduleQuizzes[selectedModule.module_id]?.length) && (
                    <div className="text-center py-5 text-muted">
                      <i className="bi bi-inbox display-4 d-block mb-3"></i>
                      <h5>No content available</h5>
                      <p>This module doesn't have any content yet.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="card shadow-sm border-0 text-center py-5">
                <i className="bi bi-journal-text display-4 text-muted mb-3"></i>
                <h5 className="text-muted">Select a Module</h5>
                <p className="text-muted">Choose a module from the sidebar to view its content</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Assignments Tab */}
      {activeTab === 'assignments' && (
        <div className="card shadow-sm border-0">
          <div className="card-header bg-light">
            <h4 className="card-title mb-0 fw-semibold">
              <i className="bi bi-clipboard-check me-2"></i>
              Course Assignments ({assignments.length})
            </h4>
          </div>
          <div className="card-body">
            {assignments.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <i className="bi bi-inbox display-4 d-block mb-3"></i>
                <h5>No assignments available</h5>
                <p>This course doesn't have any assignments yet.</p>
              </div>
            ) : (
              <div className="row">
                {assignments.map((assignment) => {
                  const status = submissionStatus[assignment.assignment_id] || { loading: false, error: null, success: false };
                  
                  return (
                    <div key={assignment.assignment_id} className="col-lg-6 col-xl-4 mb-4">
                      <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-info text-white">
                          <h6 className="card-title mb-0 fw-semibold">{assignment.title}</h6>
                        </div>
                        <div className="card-body d-flex flex-column">
                          <p className="card-text text-muted flex-grow-1">{assignment.description}</p>
                          
                          <div className="mb-3">
                            <div className="d-flex justify-content-between text-muted small">
                              <span>
                                <i className="bi bi-calendar me-1"></i>
                                {new Date(assignment.due_date).toLocaleDateString()}
                              </span>
                              <span>
                                <i className="bi bi-trophy me-1"></i>
                                {assignment.max_score || 'N/A'} points
                              </span>
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <label htmlFor={`assignment-${assignment.assignment_id}`} className="form-label fw-semibold small">
                              Submission URL:
                            </label>
                            <input 
                              type="url" 
                              className="form-control form-control-sm"
                              id={`assignment-${assignment.assignment_id}`}
                              placeholder="https://your-submission-link.com"
                              value={submissionUrls[assignment.assignment_id] || ''}
                              onChange={(e) => handleUrlChange(assignment.assignment_id, e.target.value)}
                              disabled={status.loading}
                            />
                          </div>
                          
                          {/* Status messages */}
                          {status.error && (
                            <div className="alert alert-danger py-2 mb-3">
                              <small><i className="bi bi-exclamation-triangle me-1"></i>{status.error}</small>
                            </div>
                          )}
                          
                          {status.success && (
                            <div className="alert alert-success py-2 mb-3">
                              <small><i className="bi bi-check-circle me-1"></i>Assignment submitted successfully!</small>
                            </div>
                          )}
                          
                          <button 
                            className="btn btn-primary btn-sm mt-auto"
                            onClick={() => handleAssignmentSubmit(assignment.assignment_id)}
                            disabled={status.loading}
                          >
                            {status.loading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Submitting...
                              </>
                            ) : (
                              <>
                                <i className="bi bi-send me-1"></i>Submit Assignment
                              </>
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