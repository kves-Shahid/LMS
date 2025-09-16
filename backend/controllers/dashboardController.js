import * as DashboardModel from '../models/dashboardModel.js';

export const getAdminDashboardStats = async (_req, res) => {
  try {
    const stats = await DashboardModel.getDashboardStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ msg: 'Stats fetch failed', error: err.message });
  }
};

export const getStudentDashboard = async (req, res) => {
  const { student_id } = req.params;
  try {
    const stats = await DashboardModel.getStudentStats(student_id);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ msg: 'Student stats fetch failed', error: err.message });
  }
};

export const getInstructorDashboard = async (req, res) => {
  const { instructor_id } = req.params;
  try {
    const stats = await DashboardModel.getInstructorStats(instructor_id);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ msg: 'Instructor stats fetch failed', error: err.message });
  }
};
