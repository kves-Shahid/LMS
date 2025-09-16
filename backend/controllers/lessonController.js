import * as LessonModel from '../models/lessonModel.js';

export const createLesson = async (req, res) => {
  const { module_id, title, resource, video_url, position } = req.body;

  
  if (!module_id || !title || position == null) {
    return res.status(400).json({ msg: 'module_id, title, and position are required' });
  }

  try {
    const lessonId = await LessonModel.createLesson(module_id, title, resource, video_url, position);
    res.status(201).json({ msg: 'Lesson created', lesson_id: lessonId });
  } catch (err) {
    res.status(500).json({ msg: 'Creation failed', error: err.message });
  }
};

export const getLessonsByModule = async (req, res) => {
  const { moduleId } = req.params;

  try {
    const lessons = await LessonModel.getLessonsByModule(moduleId);
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ msg: 'Fetch failed', error: err.message });
  }
};

export const getLessonContent = async (req, res) => {
  const { lessonId } = req.params;

  try {
    const lesson = await LessonModel.getLessonById(lessonId);
    if (!lesson) return res.status(404).json({ msg: 'Lesson not found' });
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ msg: 'Fetch failed', error: err.message });
  }
};
