
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

import adminRoutes from './routes/adminRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';
import instructorRoutes from './routes/instructorRoutes.js';
import lessonRoutes from './routes/lessonRoutes.js';
import moduleRoutes from './routes/moduleRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';
import instructorCourseRoutes from './routes/instructorCourseRoutes.js';

// Load env
dotenv.config();

// App setup
const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// All Routes
app.use('/api/admin', adminRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/instructor', instructorRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api', instructorCourseRoutes);

// Root endpoint
app.get('/', (_req, res) => res.send('LMS Backend API Running'));

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
