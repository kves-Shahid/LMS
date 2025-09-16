import * as AssignmentModel from '../models/assignmentModel.js';

export const createAssignment = async (req, res) => {
  const { course_id, module_id, title, description, due_date, max_score = null } = req.body;
  try {
    const insertId = await AssignmentModel.createAssignment(course_id, module_id, title, description, due_date, max_score);
    res.status(201).json({ msg: 'Assignment created', id: insertId });
  } catch (err) {
    res.status(500).json({ msg: 'Creation failed', error: err.message });
  }
};


export const getAssignmentsByModule = async (req, res) => {
  const { module_id } = req.params;
  try {
    const assignments = await AssignmentModel.getAssignmentsByModule(module_id);
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ msg: 'Fetch failed', error: err.message });
  }
};


export const getAssignmentsByCourse = async (req, res) => {
  const { courseId } = req.params;
  try {
    const assignments = await AssignmentModel.getAssignmentsByCourse(courseId);
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ msg: 'Fetch failed', error: err.message });
  }
};


export const getAssignmentById = async (req, res) => {
  const { assignmentId } = req.params;
  try {
    const assignment = await AssignmentModel.getAssignmentById(assignmentId);
    if (!assignment) return res.status(404).json({ msg: 'Assignment not found' });
    res.json(assignment);
  } catch (err) {
    res.status(500).json({ msg: 'Fetch failed', error: err.message });
  }
};


export const updateAssignment = async (req, res) => {
  const { assignmentId } = req.params;
  const { title, description, due_date, max_score } = req.body;

  try {
    const assignment = await AssignmentModel.getAssignmentById(assignmentId);
    if (!assignment) return res.status(404).json({ msg: 'Assignment not found' });

    const updates = { title, description, due_date, max_score };
    const isUpdated = await AssignmentModel.updateAssignment(assignmentId, updates);

    if (isUpdated) res.json({ msg: 'Assignment updated successfully' });
    else res.status(400).json({ msg: 'Failed to update assignment' });
  } catch (err) {
    res.status(500).json({ msg: 'Update failed', error: err.message });
  }
};


export const deleteAssignment = async (req, res) => {
  const { assignmentId } = req.params;

  try {
    const assignment = await AssignmentModel.getAssignmentById(assignmentId);
    if (!assignment) return res.status(404).json({ msg: 'Assignment not found' });

    const isDeleted = await AssignmentModel.deleteAssignment(assignmentId);
    if (isDeleted) res.json({ msg: 'Assignment deleted successfully' });
    else res.status(400).json({ msg: 'Failed to delete assignment' });
  } catch (err) {
    res.status(500).json({ msg: 'Deletion failed', error: err.message });
  }
};
