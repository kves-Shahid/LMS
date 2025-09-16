// src/pages/ModuleDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getLessonsByModule, createLesson } from '../services/lessonService';
import { getQuizzesByModule, createQuiz } from '../services/quizService';
import { getAssignmentsByModule, createAssignment } from '../services/assignmentService';

const ModuleDetails = () => {
  const { module_id } = useParams();
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [newLesson, setNewLesson] = useState({
    title: '',
    resource: '',
    video_url: '',
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

  const [isQuizFormVisible, setIsQuizFormVisible] = useState(false);
  const [isAssignmentFormVisible, setIsAssignmentFormVisible] = useState(false);

  
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const data = await getLessonsByModule(module_id);
        setLessons(data || []);
      } catch (err) {
        console.error('Failed to fetch lessons:', err);
      }
    };

    const fetchQuizzes = async () => {
      try {
        const data = await getQuizzesByModule(module_id);
        setQuizzes(data || []);
      } catch (err) {
        console.error('Failed to fetch quizzes:', err);
      }
    };

    const fetchAssignments = async () => {
      try {
        const data = await getAssignmentsByModule(module_id);
        setAssignments(data || []);
      } catch (err) {
        console.error('Failed to fetch assignments:', err);
      }
    };

    fetchLessons();
    fetchQuizzes();
    fetchAssignments();
  }, [module_id]);

 
  const handleLessonChange = (e) => {
    const { name, value } = e.target;
    setNewLesson((prev) => ({
      ...prev,
      [name]: name === 'position' ? Number(value) : value
    }));
  };

  const handleQuizChange = (e) => {
    const { name, value } = e.target;
    setNewQuiz((prev) => ({
      ...prev,
      [name]: name === 'time_limit' || name === 'total_marks' ? Number(value) : value
    }));
  };

  const handleAssignmentChange = (e) => {
    const { name, value } = e.target;
    setNewAssignment((prev) => ({
      ...prev,
      [name]: name === 'max_score' ? Number(value) : value
    }));
  };

  
  const handleLessonSubmit = async (e) => {
    e.preventDefault();
    try {
      const lessonData = {
        ...newLesson,
        module_id: Number(module_id)
      };
      const res = await createLesson(lessonData);
      if (res.lesson_id) {
        alert('Lesson created successfully');
        setNewLesson({ title: '', resource: '', video_url: '', position: newLesson.position + 1 });
        const updatedLessons = await getLessonsByModule(module_id);
        setLessons(updatedLessons);
      }
    } catch (err) {
      console.error('Error creating lesson:', err);
      alert(err?.response?.data?.msg || 'Error creating lesson');
    }
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    try {
      const quizData = {
        ...newQuiz,
        module_id: Number(module_id)
      };
      const res = await createQuiz(quizData);
      if (res.id) {
        alert('Quiz created successfully');
        setNewQuiz({ title: '', total_marks: 100, time_limit: 30 });
        const updatedQuizzes = await getQuizzesByModule(module_id);
        setQuizzes(updatedQuizzes);
      }
    } catch (err) {
      console.error('Error creating quiz:', err);
      alert(err?.response?.data?.msg || 'Error creating quiz');
    }
  };

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    try {
      const assignmentData = {
        ...newAssignment,
        module_id: Number(module_id)
      };
      const res = await createAssignment(assignmentData);
      if (res.id) {
        alert('Assignment created successfully');
        setNewAssignment({ title: '', description: '', due_date: '', max_score: 100 });
        const updatedAssignments = await getAssignmentsByModule(module_id);
        setAssignments(updatedAssignments);
      }
    } catch (err) {
      console.error('Error creating assignment:', err);
      alert(err?.response?.data?.msg || 'Error creating assignment');
    }
  };

  return (
    <div className="container">
      <h2 className="my-4">Module Details (ID: {module_id})</h2>

      <h4>Lessons</h4>
      {lessons.length === 0 ? (
        <p>No lessons available.</p>
      ) : (
        <ul className="list-group mb-4">
          {lessons.map((lesson) => (
            <li key={lesson.lesson_id} className="list-group-item">
              <strong>{lesson.position}. {lesson.title}</strong><br />
              <small>{lesson.resource}</small><br />
              <a href={lesson.video_url} target="_blank" rel="noopener noreferrer">Watch Video</a>
            </li>
          ))}
        </ul>
      )}

      <h4>Create New Lesson</h4>
      <form onSubmit={handleLessonSubmit}>
        <div className="mb-2">
          <label htmlFor="title" className="form-label">Title</label>
          <input type="text" className="form-control" name="title" value={newLesson.title} onChange={handleLessonChange} required />
        </div>
        <div className="mb-2">
          <label htmlFor="resource" className="form-label">Resource</label>
          <input type="text" className="form-control" name="resource" value={newLesson.resource} onChange={handleLessonChange} required />
        </div>
        <div className="mb-2">
          <label htmlFor="video_url" className="form-label">Video URL</label>
          <input type="url" className="form-control" name="video_url" value={newLesson.video_url} onChange={handleLessonChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="position" className="form-label">Position</label>
          <input type="number" className="form-control" name="position" min="1" value={newLesson.position} onChange={handleLessonChange} required />
        </div>
        <button type="submit" className="btn btn-primary">Create Lesson</button>
      </form>

      <h4 className="mt-5">Quizzes</h4>
      {quizzes.length === 0 ? (
        <p>No quizzes available.</p>
      ) : (
        <ul className="list-group mb-4">
          {quizzes.map((quiz) => (
            <li key={quiz.quiz_id} className="list-group-item">
              <strong>{quiz.title}</strong><br />
              <small>Time Limit: {quiz.time_limit} minutes | Total Marks: {quiz.total_marks}</small>
            </li>
          ))}
        </ul>
      )}

      <h4>Create New Quiz</h4>
      <button
        onClick={() => setIsQuizFormVisible(!isQuizFormVisible)}
        className="btn btn-warning mb-3"
      >
        {isQuizFormVisible ? 'Hide Quiz Form' : 'Show Quiz Form'}
      </button>

      {isQuizFormVisible && (
        <form onSubmit={handleQuizSubmit}>
          <div className="mb-2">
            <label htmlFor="quizTitle" className="form-label">Title</label>
            <input type="text" className="form-control" name="title" value={newQuiz.title} onChange={handleQuizChange} required />
          </div>
          <div className="mb-2">
            <label htmlFor="total_marks" className="form-label">Total Marks</label>
            <input type="number" className="form-control" name="total_marks" value={newQuiz.total_marks} onChange={handleQuizChange} required />
          </div>
          <div className="mb-2">
            <label htmlFor="time_limit" className="form-label">Time Limit (in minutes)</label>
            <input type="number" className="form-control" name="time_limit" value={newQuiz.time_limit} onChange={handleQuizChange} required />
          </div>
          <button type="submit" className="btn btn-primary">Create Quiz</button>
        </form>
      )}

      <h4 className="mt-5">Assignments</h4>
      {assignments.length === 0 ? (
        <p>No assignments available.</p>
      ) : (
        <ul className="list-group mb-4">
          {assignments.map((assignment) => (
            <li key={assignment.assignment_id} className="list-group-item">
              <strong>{assignment.title}</strong><br />
              <small>Due Date: {assignment.due_date} | Max Score: {assignment.max_score}</small>
            </li>
          ))}
        </ul>
      )}

      <h4>Create New Assignment</h4>
      <button
        onClick={() => setIsAssignmentFormVisible(!isAssignmentFormVisible)}
        className="btn btn-warning mb-3"
      >
        {isAssignmentFormVisible ? 'Hide Assignment Form' : 'Show Assignment Form'}
      </button>

      {isAssignmentFormVisible && (
        <form onSubmit={handleAssignmentSubmit}>
          <div className="mb-2">
            <label htmlFor="assignmentTitle" className="form-label">Title</label>
            <input type="text" className="form-control" name="title" value={newAssignment.title} onChange={handleAssignmentChange} required />
          </div>
          <div className="mb-2">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea className="form-control" name="description" value={newAssignment.description} onChange={handleAssignmentChange} required />
          </div>
          <div className="mb-2">
            <label htmlFor="due_date" className="form-label">Due Date</label>
            <input type="date" className="form-control" name="due_date" value={newAssignment.due_date} onChange={handleAssignmentChange} required />
          </div>
          <div className="mb-2">
            <label htmlFor="max_score" className="form-label">Max Score</label>
            <input type="number" className="form-control" name="max_score" value={newAssignment.max_score} onChange={handleAssignmentChange} required />
          </div>
          <button type="submit" className="btn btn-primary">Create Assignment</button>
        </form>
      )}
    </div>
  );
};

export default ModuleDetails;
