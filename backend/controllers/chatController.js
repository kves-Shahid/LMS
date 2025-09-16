import * as ChatModel from '../models/chatModel.js';

export const postMessage = async (req, res) => {
  const { course_id, message } = req.body;

  if (!course_id || !message) {
    return res.status(400).json({ msg: 'Course ID and message are required' });
  }

  try {
    await ChatModel.insertMessage(course_id, message, req); 
    res.status(201).json({ msg: 'Message sent' });
  } catch (err) {
    res.status(500).json({ msg: 'Sending failed', error: err.message });
  }
};


export const getMessagesByCourse = async (req, res) => {
  const { course_id } = req.params;

  try {
    const messages = await ChatModel.getMessagesByCourse(course_id);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ msg: 'Fetch failed', error: err.message });
  }
};
