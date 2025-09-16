
import * as CourseModel from '../models/courseModel.js';

export const createCourse = async (req, res) => {
  const { title, description, category, language, price, status = 'draft' } = req.body;
  const instructor_id = req.user.instructor_id; 

  try {
  
    const id = await CourseModel.createCourse(instructor_id, title, description, category, language, price, status);

    
    const updatedCourses = await CourseModel.fetchInstructorCourses(instructor_id);

    
    res.status(201).json({
      msg: 'Course created successfully',
      courses: updatedCourses,  
    });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to create course', error: err.message });
  }
};

export const updateCourse = async (req, res) => {
  const { course_id } = req.params;
  const { title, description, category, language, price, status } = req.body;
  const instructor_id = req.user.instructor_id;  

  try {
    
    const course = await CourseModel.fetchCourseById(course_id);

    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    
    if (course.instructor_id !== instructor_id) {
      return res.status(403).json({ msg: 'You are not authorized to update this course' });
    }

    
    await CourseModel.updateCourse(course_id, title, description, category, language, price, status);
    res.json({ msg: 'Course updated' });
  } catch (err) {
    res.status(500).json({ msg: 'Update failed', error: err.message });
  }
};

export const deleteCourse = async (req, res) => {
  const { course_id } = req.params;
  const instructor_id = req.user.instructor_id;  

  try {
    
    const course = await CourseModel.fetchCourseById(course_id);

    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    
    if (course.instructor_id !== instructor_id) {
      return res.status(403).json({ msg: 'You are not authorized to delete this course' });
    }

    
    await CourseModel.deleteCourse(course_id);
    res.json({ msg: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Delete failed', error: err.message });
  }
};


export const getAllCourses = async (_req, res) => {
  try {
    const rows = await CourseModel.fetchPublishedCourses();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to retrieve courses', error: err.message });
  }
};

export const getCourseById = async (req, res) => {
  const { course_id } = req.params;

  try {
    const course = await CourseModel.fetchCourseById(course_id);
    if (!course) return res.status(404).json({ msg: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ msg: 'Fetch failed', error: err.message });
  }
};


export const getInstructorCourses = async (req, res) => {
  const instructor_id = req.user.instructor_id;  

  try {
    const courses = await CourseModel.fetchInstructorCourses(instructor_id);
    res.json(courses);  
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching instructor courses', error: err.message });
  }
};

export const getCourseDetailsForStudent = async (req, res) => {
  const { course_id } = req.params;
  const student_id = req.user.student_id;

  try {
    
    const course = await CourseModel.fetchCourseById(course_id);
    if (!course) return res.status(404).json({ msg: 'Course not found' });

   
    const modules = await ModuleModel.getModulesByCourse(course_id);

   
    const courseDetails = await Promise.all(
      modules.map(async (module) => {
        const [lessons, quizzes, assignments] = await Promise.all([
          LessonModel.getLessonsByModule(module.module_id),
          QuizModel.fetchQuizzesByModule(module.module_id),
          AssignmentModel.getAssignmentsByModule(module.module_id)
        ]);

        return {
          ...module,
          lessons,
          quizzes,
          assignments
        };
      })
    );

  
    const isEnrolled = await checkEnrollment(student_id, course_id);

    res.json({
      course,
      modules: courseDetails,
      isEnrolled
    });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch course details', error: err.message });
  }
};


const checkEnrollment = async (student_id, course_id) => {
  const [rows] = await pool.query(
    'SELECT * FROM enrollment WHERE student_id = ? AND course_id = ?',
    [student_id, course_id]
  );
  return rows.length > 0;
};