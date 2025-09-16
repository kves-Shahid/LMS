import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getModulesByCourse, createModule, updateModule, deleteModule } from '../services/moduleService';
import { createQuiz, getQuizzesByModule } from '../services/quizService';
import { createAssignment, getAssignmentsByModule, deleteAssignment } from '../services/assignmentService';
import { createLesson, getLessonsByModule } from '../services/lessonService';
import { getInstructorCourseDetails } from '../services/instructorService';

const CourseDetails = () => {
  const [course, setCourse] = useState(null);
  const { course_id } = useParams();
  const [modules, setModules] = useState([]);
  const [moduleQuizzes, setModuleQuizzes] = useState({});
  const [moduleAssignments, setModuleAssignments] = useState({});
  const [moduleLessons, setModuleLessons] = useState({});
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [newModule, setNewModule] = useState({
    title: '',
    description: '',
    position: 1
  });
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    total_marks: 100,
    time_limit: 30
  });
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    due_date: '',
    max_score: 100
  });
  const [newLesson, setNewLesson] = useState({
    title: '',
    content: '',
    video_url: '',
    position: 1
  });

  // Fetch modules when component mounts
const fetchModules = useCallback(async () => {
  try {
    // First, try to fetch course details using instructor service
    try {
      const instructorId = localStorage.getItem('userId') || localStorage.getItem('instructor_id');
      if (instructorId) {
        const courseData = await getInstructorCourseDetails(instructorId);
        const currentCourse = courseData.find(c => c.course_id === parseInt(course_id));
        if (currentCourse) {
          setCourse(currentCourse);
        }
      }
    } catch (err) {
      console.log('Could not fetch instructor course details, proceeding without course data');
    }

    // Then fetch modules as before
    const data = await getModulesByCourse(course_id);
    setModules(data || []);
    
    // Fetch quizzes, assignments, and lessons for each module (KEEP ALL THIS CODE THE SAME)
    if (data && data.length > 0) {
      const quizzesPromises = data.map(async (module) => {
        try {
          const quizzes = await getQuizzesByModule(module.module_id);
          return { moduleId: module.module_id, quizzes };
        } catch (err) {
          console.error(`Failed to fetch quizzes for module ${module.module_id}:`, err);
          return { moduleId: module.module_id, quizzes: [] };
        }
      });
      
      const assignmentsPromises = data.map(async (module) => {
        try {
          const assignments = await getAssignmentsByModule(module.module_id);
          return { moduleId: module.module_id, assignments };
        } catch (err) {
          console.error(`Failed to fetch assignments for module ${module.module_id}:`, err);
          return { moduleId: module.module_id, assignments: [] };
        }
      });

      const lessonsPromises = data.map(async (module) => {
        try {
          const lessons = await getLessonsByModule(module.module_id);
          return { moduleId: module.module_id, lessons };
        } catch (err) {
          console.error(`Failed to fetch lessons for module ${module.module_id}:`, err);
          return { moduleId: module.module_id, lessons: [] };
        }
      });
      
      const [quizzesResults, assignmentsResults, lessonsResults] = await Promise.all([
        Promise.all(quizzesPromises),
        Promise.all(assignmentsPromises),
        Promise.all(lessonsPromises)
      ]);
      
      const quizzesMap = {};
      quizzesResults.forEach(result => {
        quizzesMap[result.moduleId] = result.quizzes;
      });
      setModuleQuizzes(quizzesMap);
      
      const assignmentsMap = {};
      assignmentsResults.forEach(result => {
        assignmentsMap[result.moduleId] = result.assignments;
      });
      setModuleAssignments(assignmentsMap);

      const lessonsMap = {};
      lessonsResults.forEach(result => {
        lessonsMap[result.moduleId] = result.lessons;
      });
      setModuleLessons(lessonsMap);
    }
  } catch (err) {
    console.error('Failed to fetch modules:', err);
  }
}, [course_id]);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  // Handle input changes for new module form
  const handleModuleChange = (e) => {
    const { name, value } = e.target;
    setNewModule((prev) => ({
      ...prev,
      [name]: name === 'position' ? Number(value) : value
    }));
  };

  // Handle input changes for new quiz form
  const handleQuizChange = (e) => {
    const { name, value } = e.target;
    setNewQuiz((prev) => ({
      ...prev,
      [name]: name === 'total_marks' || name === 'time_limit' ? Number(value) : value
    }));
  };

  // Handle input changes for new assignment form
  const handleAssignmentChange = (e) => {
    const { name, value } = e.target;
    setNewAssignment((prev) => ({
      ...prev,
      [name]: name === 'max_score' ? Number(value) : value
    }));
  };

  // Handle input changes for new lesson form
  const handleLessonChange = (e) => {
    const { name, value } = e.target;
    setNewLesson((prev) => ({
      ...prev,
      [name]: name === 'position' ? Number(value) : value
    }));
  };

  // Handle new module form submission
  const handleModuleSubmit = async (e) => {
    e.preventDefault();
    try {
      const moduleData = {
        ...newModule,
        course_id: Number(course_id)
      };
      
      if (editingModule) {
        // Update existing module and get the updated data
        const updatedModule = await updateModule(editingModule.module_id, moduleData);
        alert('Module updated successfully');
        
        // Update local state immediately without refetching
        setModules(prev => prev.map(mod => 
          mod.module_id === editingModule.module_id ? updatedModule : mod
        ));
      } else {
        // Create new module
        const res = await createModule(moduleData);
        if (res.module_id) {
          alert('Module created successfully');
          // Refresh the modules list for new module
          await fetchModules();
        }
      }
      
      // Reset form
      setNewModule({ title: '', description: '', position: newModule.position + 1 });
      setShowModuleForm(false);
      setEditingModule(null);
      
    } catch (err) {
      console.error('Error creating/updating module:', err);
      alert(err?.response?.data?.msg || 'Error processing module');
    }
  };

  // Handle new quiz form submission
  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    if (!selectedModule) return;
    
    try {
      const quizData = {
        ...newQuiz,
        module_id: selectedModule.module_id
      };
      const res = await createQuiz(quizData);
      if (res.id) {
        alert('Quiz created successfully');
        setNewQuiz({ title: '', total_marks: 100, time_limit: 30 });
        setShowQuizForm(false);
        setSelectedModule(null);
        await fetchModules();
      }
    } catch (err) {
      console.error('Error creating quiz:', err);
      alert(err?.response?.data?.msg || 'Error creating quiz');
    }
  };

  // Handle new assignment form submission
  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedModule) return;
    
    try {
      const assignmentData = {
        ...newAssignment,
        module_id: selectedModule.module_id,
        course_id: Number(course_id)
      };
      const res = await createAssignment(assignmentData);
      if (res.id) {
        alert('Assignment created successfully');
        setNewAssignment({ title: '', description: '', due_date: '', max_score: 100 });
        setShowAssignmentForm(false);
        setSelectedModule(null);
        await fetchModules();
      }
    } catch (err) {
      console.error('Error creating assignment:', err);
      alert(err?.response?.data?.msg || 'Error creating assignment');
    }
  };

  // Handle new lesson form submission
  const handleLessonSubmit = async (e) => {
    e.preventDefault();
    if (!selectedModule) return;
    
    try {
      const lessonData = {
        ...newLesson,
        module_id: selectedModule.module_id
      };
      const res = await createLesson(lessonData);
      if (res.lesson_id) {
        alert('Lesson created successfully');
        setNewLesson({ title: '', content: '', video_url: '', position: newLesson.position + 1 });
        setShowLessonForm(false);
        setSelectedModule(null);
        await fetchModules();
      }
    } catch (err) {
      console.error('Error creating lesson:', err);
      alert(err?.response?.data?.msg || 'Error creating lesson');
    }
  };

  // Open quiz form for a specific module
  const openQuizForm = (module) => {
    setSelectedModule(module);
    setShowQuizForm(true);
  };

  // Open assignment form for a specific module
  const openAssignmentForm = (module) => {
    setSelectedModule(module);
    setShowAssignmentForm(true);
  };

  // Open lesson form for a specific module
  const openLessonForm = (module) => {
    setSelectedModule(module);
    setShowLessonForm(true);
  };

  // Edit module
  const editModule = (module) => {
    setEditingModule(module);
    setNewModule({
      title: module.title,
      description: module.description,
      position: module.position
    });
    setShowModuleForm(true);
  };

  // Delete module
  const deleteModuleHandler = async (moduleId) => {
    if (window.confirm('Are you sure you want to delete this module? This will also delete all associated content.')) {
      try {
        await deleteModule(moduleId);
        alert('Module deleted successfully');
        await fetchModules();
      } catch (err) {
        console.error('Error deleting module:', err);
        alert(err?.response?.data?.msg || 'Error deleting module');
      }
    }
  };

  // Delete assignment
  const deleteAssignmentHandler = async (assignmentId, moduleId) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await deleteAssignment(assignmentId);
        alert('Assignment deleted successfully');
        // Update local state to remove the assignment
        setModuleAssignments(prev => ({
          ...prev,
          [moduleId]: prev[moduleId].filter(assignment => assignment.assignment_id !== assignmentId)
        }));
      } catch (err) {
        console.error('Error deleting assignment:', err);
        alert(err?.response?.data?.msg || 'Error deleting assignment');
      }
    }
  };

  // Cancel form editing
  const cancelForm = () => {
    setShowModuleForm(false);
    setShowQuizForm(false);
    setShowAssignmentForm(false);
    setShowLessonForm(false);
    setEditingModule(null);
    setSelectedModule(null);
    setNewModule({ title: '', description: '', position: 1 });
    setNewQuiz({ title: '', total_marks: 100, time_limit: 30 });
    setNewAssignment({ title: '', description: '', due_date: '', max_score: 100 });
    setNewLesson({ title: '', content: '', video_url: '', position: 1 });
  };

  return (
    
    <div className="container">
      <h2 className="my-4">Course Details (ID: {course_id})</h2>

      <div className="d-flex gap-2 mb-4">
        <button 
          className="btn btn-primary" 
          onClick={() => setShowModuleForm(!showModuleForm)}
        >
          {showModuleForm ? 'Cancel' : 'Create Module'}
        </button>
          {/* ADD THE SHOW STATS BUTTON RIGHT HERE */}
  <Link 
    to={`/courses/${course_id}/stats`}
    className="btn btn-info"
  >
    Show Stats
  </Link>
      </div>
      {/* Course Information */}
{course && (
  <div className="card mb-4">
    <div className="card-body">
      <h2 className="card-title">{course.title}</h2>
      <p className="card-text">{course.description}</p>
      <div className="d-flex gap-2 flex-wrap">
        <span className="badge bg-primary">{course.category}</span>
        <span className="badge bg-secondary">{course.language}</span>
        <span className="badge bg-info">{course.status}</span>
        {course.price > 0 && <span className="badge bg-success">${course.price}</span>}
      </div>
    </div>
  </div>
)}
      {/* Module Creation/Edit Form */}
      {showModuleForm && (
        <div className="card mb-4">
          <div className="card-header">
            <h5>{editingModule ? 'Edit' : 'Create New'} Module</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleModuleSubmit}>
              <div className="mb-2">
                <label htmlFor="title" className="form-label">Title</label>
                <input type="text" className="form-control" name="title" value={newModule.title} onChange={handleModuleChange} required />
              </div>
              <div className="mb-2">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea className="form-control" name="description" rows="3" value={newModule.description} onChange={handleModuleChange} required />
              </div>
              <div className="mb-3">
                <label htmlFor="position" className="form-label">Position</label>
                <input type="number" className="form-control" name="position" min="1" value={newModule.position} onChange={handleModuleChange} required />
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success">{editingModule ? 'Update' : 'Create'} Module</button>
                <button type="button" className="btn btn-secondary" onClick={cancelForm}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quiz Creation Form */}
      {showQuizForm && selectedModule && (
        <div className="card mb-4">
          <div className="card-header">
            <h5>Create Quiz for Module: {selectedModule.title}</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleQuizSubmit}>
              <div className="mb-2">
                <label htmlFor="quizTitle" className="form-label">Quiz Title</label>
                <input type="text" className="form-control" name="title" value={newQuiz.title} onChange={handleQuizChange} required />
              </div>
              <div className="mb-2">
                <label htmlFor="total_marks" className="form-label">Total Marks</label>
                <input type="number" className="form-control" name="total_marks" min="1" value={newQuiz.total_marks} onChange={handleQuizChange} required />
              </div>
              <div className="mb-3">
                <label htmlFor="time_limit" className="form-label">Time Limit (minutes)</label>
                <input type="number" className="form-control" name="time_limit" min="1" value={newQuiz.time_limit} onChange={handleQuizChange} required />
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success">Create Quiz</button>
                <button type="button" className="btn btn-secondary" onClick={cancelForm}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assignment Creation Form */}
      {showAssignmentForm && selectedModule && (
        <div className="card mb-4">
          <div className="card-header">
            <h5>Create Assignment for Module: {selectedModule.title}</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleAssignmentSubmit}>
              <div className="mb-2">
                <label htmlFor="assignmentTitle" className="form-label">Assignment Title</label>
                <input type="text" className="form-control" name="title" value={newAssignment.title} onChange={handleAssignmentChange} required />
              </div>
              <div className="mb-2">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea className="form-control" name="description" rows="3" value={newAssignment.description} onChange={handleAssignmentChange} required />
              </div>
              <div className="mb-2">
                <label htmlFor="due_date" className="form-label">Due Date</label>
                <input type="datetime-local" className="form-control" name="due_date" value={newAssignment.due_date} onChange={handleAssignmentChange} required />
              </div>
              <div className="mb-3">
                <label htmlFor="max_score" className="form-label">Maximum Score</label>
                <input type="number" className="form-control" name="max_score" min="1" value={newAssignment.max_score} onChange={handleAssignmentChange} required />
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success">Create Assignment</button>
                <button type="button" className="btn btn-secondary" onClick={cancelForm}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lesson Creation Form */}
      {showLessonForm && selectedModule && (
        <div className="card mb-4">
          <div className="card-header">
            <h5>Create Lesson for Module: {selectedModule.title}</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleLessonSubmit}>
              <div className="mb-2">
                <label htmlFor="lessonTitle" className="form-label">Lesson Title</label>
                <input type="text" className="form-control" name="title" value={newLesson.title} onChange={handleLessonChange} required />
              </div>
              <div className="mb-2">
                <label htmlFor="content" className="form-label">Content</label>
                <textarea className="form-control" name="content" rows="3" value={newLesson.content} onChange={handleLessonChange} required />
              </div>
              <div className="mb-2">
                <label htmlFor="video_url" className="form-label">Video URL (optional)</label>
                <input type="url" className="form-control" name="video_url" value={newLesson.video_url} onChange={handleLessonChange} />
              </div>
              <div className="mb-3">
                <label htmlFor="position" className="form-label">Position</label>
                <input type="number" className="form-control" name="position" min="1" value={newLesson.position} onChange={handleLessonChange} required />
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success">Create Lesson</button>
                <button type="button" className="btn btn-secondary" onClick={cancelForm}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <h4>Modules</h4>
      {modules.length === 0 ? (
        <p>No modules available.</p>
      ) : (
        <div className="row">
          {modules.map((mod) => (
            <div key={mod.module_id} className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">{mod.position}. {mod.title}</h5>
                  <div className="btn-group">
                    <button 
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => editModule(mod)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => deleteModuleHandler(mod.module_id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <p className="card-text">{mod.description}</p>
                  
                  {/* Display Lessons for this Module */}
                  {moduleLessons[mod.module_id] && moduleLessons[mod.module_id].length > 0 && (
                    <div className="mt-3">
                      <h6>Lessons:</h6>
                      <ul className="list-group list-group-flush">
                        {moduleLessons[mod.module_id].map((lesson) => (
                          <li key={lesson.lesson_id} className="list-group-item p-2">
                            <div className="d-flex justify-content-between align-items-center">
                              <span>
                                <strong>{lesson.title}</strong>
                                {lesson.video_url && (
                                  <br />
                                )}
                                {lesson.video_url && (
                                  <small className="text-muted">
                                    Video: {lesson.video_url}
                                  </small>
                                )}
                              </span>
                              <span className="badge bg-secondary">Lesson</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Display Quizzes for this Module */}
                  {moduleQuizzes[mod.module_id] && moduleQuizzes[mod.module_id].length > 0 && (
                    <div className="mt-3">
                      <h6>Quizzes:</h6>
                      <ul className="list-group list-group-flush">
                        {moduleQuizzes[mod.module_id].map((quiz) => (
                          <li key={quiz.quiz_id} className="list-group-item p-2">
                            <div className="d-flex justify-content-between align-items-center">
                              <span>
                                <strong>{quiz.title}</strong>
                                <br />
                                <small className="text-muted">
                                  {quiz.total_marks} marks • {quiz.time_limit} mins
                                </small>
                              </span>
                              <span className="badge bg-info">Quiz</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Display Assignments for this Module */}
                  {moduleAssignments[mod.module_id] && moduleAssignments[mod.module_id].length > 0 && (
                    <div className="mt-3">
                      <h6>Assignments:</h6>
                      <ul className="list-group list-group-flush">
                        {moduleAssignments[mod.module_id].map((assignment) => (
                          <li key={assignment.assignment_id} className="list-group-item p-2">
                            <div className="d-flex justify-content-between align-items-center">
                              <span>
                                <strong>{assignment.title}</strong>
                                <br />
                                <small className="text-muted">
                                  Due: {new Date(assignment.due_date).toLocaleString()} • {assignment.max_score} points
                                </small>
                              </span>
                              <div>
                                <span className="badge bg-warning me-2">Assignment</span>
                                <button 
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => deleteAssignmentHandler(assignment.assignment_id, mod.module_id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="d-flex gap-2 mt-3 flex-wrap">
                    <Link to={`/modules/${mod.module_id}`} className="btn btn-info btn-sm">
                      View Details
                    </Link>
                    <button 
                      className="btn btn-warning btn-sm"
                      onClick={() => openQuizForm(mod)}
                    >
                      Create Quiz
                    </button>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => openAssignmentForm(mod)}
                    >
                      Create Assignment
                    </button>
                    <button 
                      className="btn btn-success btn-sm"
                      onClick={() => openLessonForm(mod)}
                    >
                      Create Lesson
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseDetails;