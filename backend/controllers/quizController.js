
import * as QuizModel from '../models/quizModel.js';

export const createQuiz = async (req, res) => {
  const { module_id, title, total_marks, time_limit } = req.body;

  try {
    const id = await QuizModel.insertQuiz(module_id, title, total_marks, time_limit);
    res.status(201).json({ msg: 'Quiz created', id });
  } catch (err) {
    res.status(500).json({ msg: 'Creation failed', error: err.message });
  }
};

export const submitQuiz = async (req, res) => {
  const { quiz_id, student_id, score, attempt_no } = req.body;

  try {
    const exists = await QuizModel.checkAttemptExists(quiz_id, student_id, attempt_no);
    if (exists) return res.status(400).json({ msg: 'Attempt already exists' });

    await QuizModel.submitQuizAttempt(quiz_id, student_id, score, attempt_no);
    res.status(201).json({ msg: 'Quiz submitted' });
  } catch (err) {
    res.status(500).json({ msg: 'Submission failed', error: err.message });
  }
};

export const getQuizAttempts = async (req, res) => {
  const { quizId } = req.params;

  try {
    const attempts = await QuizModel.getAttemptsByQuizId(quizId);
    res.json(attempts);
  } catch (err) {
    res.status(500).json({ msg: 'Fetch failed', error: err.message });
  }
};


export const getQuizzesByModule = async (req, res) => {
  const { module_id } = req.params;

  try {
    const quizzes = await QuizModel.fetchQuizzesByModule(module_id);
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch quizzes', error: err.message });
  }
};