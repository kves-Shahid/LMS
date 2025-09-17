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
  const [expandedModule, setExpandedModule] = useState(null);
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

      
      const data = await getModulesByCourse(course_id);
      setModules(data || []);
      
      
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

  // Toggle module expansion
  const toggleModuleExpansion = (moduleId) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

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
    <div className="container py-4">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Course Management</h2>
          <p className="text-muted">Manage your course content and structure</p>
        </div>
        <div className="d-flex gap-2">
          <button 
            className={`btn ${showModuleForm ? 'btn-secondary' : 'btn-primary'} d-flex align-items-center`}
            onClick={() => setShowModuleForm(!showModuleForm)}
          >
            <i className={`bi ${showModuleForm ? 'bi-x-circle' : 'bi-plus-circle'} me-2`}></i>
            {showModuleForm ? 'Cancel' : 'Create Module'}
          </button>
          <Link 
            to={`/courses/${course_id}/stats`}
            className="btn btn-info d-flex align-items-center"
          >
            <i className="bi bi-graph-up me-2"></i>Show Stats
          </Link>
        </div>
      </div>

      {/* Course Information */}
      {course && (
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <h3 className="card-title fw-bold text-primary">{course.title}</h3>
            <p className="card-text text-muted">{course.description}</p>
            <div className="d-flex gap-2 flex-wrap">
              <span className="badge bg-primary">
                <i className="bi bi-tag me-1"></i>{course.category}
              </span>
              <span className="badge bg-secondary">
                <i className="bi bi-translate me-1"></i>{course.language}
              </span>
              <span className={`badge ${course.status === 'published' ? 'bg-success' : 'bg-warning'}`}>
                <i className={`bi ${course.status === 'published' ? 'bi-check-circle' : 'bi-pencil-square'} me-1`}></i>
                {course.status}
              </span>
              {course.price > 0 && (
                <span className="badge bg-success">
                  <i className="bi bi-currency-dollar me-1"></i>${course.price}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Module Creation/Edit Form */}
      {showModuleForm && (
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-header bg-light">
            <h5 className="card-title mb-0 fw-semibold">
              <i className="bi bi-journal-plus me-2"></i>
              {editingModule ? 'Edit' : 'Create New'} Module
            </h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleModuleSubmit}>
              <div className="row">
                <div className="col-md-8">
                  <div className="form-group mb-3">
                    <label htmlFor="title" className="form-label fw-semibold">Title *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="title" 
                      value={newModule.title} 
                      onChange={handleModuleChange} 
                      required 
                      placeholder="Enter module title"
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group mb-3">
                    <label htmlFor="position" className="form-label fw-semibold">Position *</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      name="position" 
                      min="1" 
                      value={newModule.position} 
                      onChange={handleModuleChange} 
                      required 
                    />
                  </div>
                </div>
              </div>
              <div className="form-group mb-3">
                <label htmlFor="description" className="form-label fw-semibold">Description *</label>
                <textarea 
                  className="form-control" 
                  name="description" 
                  rows="3" 
                  value={newModule.description} 
                  onChange={handleModuleChange} 
                  required 
                  placeholder="Describe what this module covers"
                />
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success">
                  <i className={`bi ${editingModule ? 'bi-check' : 'bi-plus'} me-2`}></i>
                  {editingModule ? 'Update' : 'Create'} Module
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={cancelForm}>
                  <i className="bi bi-x me-2"></i>Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quiz Creation Form */}
      {showQuizForm && selectedModule && (
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-header bg-light">
            <h5 className="card-title mb-0 fw-semibold">
              <i className="bi bi-question-circle me-2"></i>
              Create Quiz for: {selectedModule.title}
            </h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleQuizSubmit}>
              <div className="form-group mb-3">
                <label htmlFor="quizTitle" className="form-label fw-semibold">Quiz Title *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="title" 
                  value={newQuiz.title} 
                  onChange={handleQuizChange} 
                  required 
                  placeholder="Enter quiz title"
                />
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label htmlFor="total_marks" className="form-label fw-semibold">Total Marks *</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      name="total_marks" 
                      min="1" 
                      value={newQuiz.total_marks} 
                      onChange={handleQuizChange} 
                      required 
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label htmlFor="time_limit" className="form-label fw-semibold">Time Limit (minutes) *</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      name="time_limit" 
                      min="1" 
                      value={newQuiz.time_limit} 
                      onChange={handleQuizChange} 
                      required 
                    />
                  </div>
                </div>
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success">
                  <i className="bi bi-plus me-2"></i>Create Quiz
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={cancelForm}>
                  <i className="bi bi-x me-2"></i>Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assignment Creation Form */}
      {showAssignmentForm && selectedModule && (
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-header bg-light">
            <h5 className="card-title mb-0 fw-semibold">
              <i className="bi bi-clipboard-check me-2"></i>
              Create Assignment for: {selectedModule.title}
            </h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleAssignmentSubmit}>
              <div className="form-group mb-3">
                <label htmlFor="assignmentTitle" className="form-label fw-semibold">Assignment Title *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="title" 
                  value={newAssignment.title} 
                  onChange={handleAssignmentChange} 
                  required 
                  placeholder="Enter assignment title"
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="description" className="form-label fw-semibold">Description *</label>
                <textarea 
                  className="form-control" 
                  name="description" 
                  rows="3" 
                  value={newAssignment.description} 
                  onChange={handleAssignmentChange} 
                  required 
                  placeholder="Describe the assignment requirements"
                />
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label htmlFor="due_date" className="form-label fw-semibold">Due Date *</label>
                    <input 
                      type="datetime-local" 
                      className="form-control" 
                      name="due_date" 
                      value={newAssignment.due_date} 
                      onChange={handleAssignmentChange} 
                      required 
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label htmlFor="max_score" className="form-label fw-semibold">Maximum Score *</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      name="max_score" 
                      min="1" 
                      value={newAssignment.max_score} 
                      onChange={handleAssignmentChange} 
                      required 
                    />
                  </div>
                </div>
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success">
                  <i className="bi bi-plus me-2"></i>Create Assignment
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={cancelForm}>
                  <i className="bi bi-x me-2"></i>Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lesson Creation Form */}
      {showLessonForm && selectedModule && (
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-header bg-light">
            <h5 className="card-title mb-0 fw-semibold">
              <i className="bi bi-book me-2"></i>
              Create Lesson for: {selectedModule.title}
            </h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleLessonSubmit}>
              <div className="form-group mb-3">
                <label htmlFor="lessonTitle" className="form-label fw-semibold">Lesson Title *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="title" 
                  value={newLesson.title} 
                  onChange={handleLessonChange} 
                  required 
                  placeholder="Enter lesson title"
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="content" className="form-label fw-semibold">Content *</label>
                <textarea 
                  className="form-control" 
                  name="content" 
                  rows="4" 
                  value={newLesson.content} 
                  onChange={handleLessonChange} 
                  required 
                  placeholder="Enter lesson content"
                />
              </div>
              <div className="row">
                <div className="col-md-8">
                  <div className="form-group mb-3">
                    <label htmlFor="video_url" className="form-label fw-semibold">Video URL (optional)</label>
                    <input 
                      type="url" 
                      className="form-control" 
                      name="video_url" 
                      value={newLesson.video_url} 
                      onChange={handleLessonChange} 
                      placeholder="https://example.com/video"
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group mb-3">
                    <label htmlFor="position" className="form-label fw-semibold">Position *</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      name="position" 
                      min="1" 
                      value={newLesson.position} 
                      onChange={handleLessonChange} 
                      required 
                    />
                  </div>
                </div>
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success">
                  <i className="bi bi-plus me-2"></i>Create Lesson
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={cancelForm}>
                  <i className="bi bi-x me-2"></i>Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modules Section */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white">
          <h4 className="card-title mb-0 fw-bold">
            <i className="bi bi-journals me-2"></i>
            Course Modules ({modules.length})
          </h4>
        </div>
        <div className="card-body">
          {modules.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-journal-plus display-4 text-muted mb-3"></i>
              <h5 className="text-muted">No modules yet!</h5>
              <p className="text-muted">Create your first module to get started.</p>
            </div>
          ) : (
            <div className="accordion" id="modulesAccordion">
              {modules.map((mod) => (
                <div key={mod.module_id} className="accordion-item border-0 mb-3">
                  <h2 className="accordion-header">
                    <button
                      className={`accordion-button ${expandedModule === mod.module_id ? '' : 'collapsed'} fw-semibold`}
                      type="button"
                      onClick={() => toggleModuleExpansion(mod.module_id)}
                    >
                      <span className="badge bg-primary me-3">{mod.position}</span>
                      {mod.title}
                      <span className="ms-auto d-flex gap-3">
                        <span className="badge bg-light text-dark">
                          <i className="bi bi-book me-1"></i>{moduleLessons[mod.module_id]?.length || 0}
                        </span>
                        <span className="badge bg-light text-dark">
                          <i className="bi bi-question-circle me-1"></i>{moduleQuizzes[mod.module_id]?.length || 0}
                        </span>
                        <span className="badge bg-light text-dark">
                          <i className="bi bi-clipboard-check me-1"></i>{moduleAssignments[mod.module_id]?.length || 0}
                        </span>
                      </span>
                    </button>
                  </h2>
                  <div className={`accordion-collapse collapse ${expandedModule === mod.module_id ? 'show' : ''}`}>
                    <div className="accordion-body">
                      <p className="text-muted mb-3">{mod.description}</p>
                      
                      {/* Module Actions */}
                      <div className="d-flex gap-2 mb-4">
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => editModule(mod)}
                        >
                          <i className="bi bi-pencil me-1"></i>Edit
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => deleteModuleHandler(mod.module_id)}
                        >
                          <i className="bi bi-trash me-1"></i>Delete
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-warning"
                          onClick={() => openQuizForm(mod)}
                        >
                          <i className="bi bi-question-circle me-1"></i>Add Quiz
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-info"
                          onClick={() => openAssignmentForm(mod)}
                        >
                          <i className="bi bi-clipboard-check me-1"></i>Add Assignment
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-success"
                          onClick={() => openLessonForm(mod)}
                        >
                          <i className="bi bi-book me-1"></i>Add Lesson
                        </button>
                      </div>

                      {/* Lessons Section */}
                      {moduleLessons[mod.module_id]?.length > 0 && (
                        <div className="mb-4">
                          <h6 className="fw-semibold text-primary mb-3">
                            <i className="bi bi-book me-2"></i>Lessons
                          </h6>
                          <div className="row">
                            {moduleLessons[mod.module_id].map((lesson) => (
                              <div key={lesson.lesson_id} className="col-md-6 mb-3">
                                <div className="card border-0 shadow-sm">
                                  <div className="card-body">
                                    <h6 className="card-title fw-semibold">{lesson.title}</h6>
                                    <p className="card-text text-muted small">{lesson.content?.substring(0, 100)}...</p>
                                    {lesson.video_url && (
                                      <small className="text-primary">
                                        <i className="bi bi-play-btn me-1"></i>Video available
                                      </small>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Quizzes Section */}
                      {moduleQuizzes[mod.module_id]?.length > 0 && (
                        <div className="mb-4">
                          <h6 className="fw-semibold text-info mb-3">
                            <i className="bi bi-question-circle me-2"></i>Quizzes
                          </h6>
                          <div className="row">
                            {moduleQuizzes[mod.module_id].map((quiz) => (
                              <div key={quiz.quiz_id} className="col-md-6 mb-3">
                                <div className="card border-0 shadow-sm">
                                  <div className="card-body">
                                    <h6 className="card-title fw-semibold">{quiz.title}</h6>
                                    <div className="d-flex gap-3 text-muted small">
                                      <span><i className="bi bi-star me-1"></i>{quiz.total_marks} marks</span>
                                      <span><i className="bi bi-clock me-1"></i>{quiz.time_limit} mins</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Assignments Section */}
                      {moduleAssignments[mod.module_id]?.length > 0 && (
                        <div className="mb-4">
                          <h6 className="fw-semibold text-warning mb-3">
                            <i className="bi bi-clipboard-check me-2"></i>Assignments
                          </h6>
                          <div className="row">
                            {moduleAssignments[mod.module_id].map((assignment) => (
                              <div key={assignment.assignment_id} className="col-md-6 mb-3">
                                <div className="card border-0 shadow-sm">
                                  <div className="card-body">
                                    <h6 className="card-title fw-semibold">{assignment.title}</h6>
                                    <p className="card-text text-muted small">{assignment.description?.substring(0, 100)}...</p>
                                    <div className="d-flex justify-content-between align-items-center">
                                      <small className="text-muted">
                                        Due: {new Date(assignment.due_date).toLocaleDateString()}
                                      </small>
                                      <small className="fw-semibold">{assignment.max_score} points</small>
                                    </div>
                                    <button 
                                      className="btn btn-sm btn-outline-danger mt-2"
                                      onClick={() => deleteAssignmentHandler(assignment.assignment_id, mod.module_id)}
                                    >
                                      <i className="bi bi-trash me-1"></i>Delete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Empty State Messages */}
                      {(!moduleLessons[mod.module_id]?.length && 
                        !moduleQuizzes[mod.module_id]?.length && 
                        !moduleAssignments[mod.module_id]?.length) && (
                        <div className="text-center py-4 text-muted">
                          <i className="bi bi-inbox display-6 mb-2"></i>
                          <p>No content added yet. Add lessons, quizzes, or assignments to get started.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;