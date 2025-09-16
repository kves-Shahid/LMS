

ALTER TABLE instructor_social_link
  ADD CONSTRAINT fk_social_instructor
  FOREIGN KEY (instructor_id) REFERENCES instructor(instructor_id)
  ON DELETE CASCADE;

ALTER TABLE course
  ADD CONSTRAINT fk_course_instructor
  FOREIGN KEY (instructor_id) REFERENCES instructor(instructor_id)
  ON DELETE SET NULL;

ALTER TABLE enrollment
  ADD CONSTRAINT fk_enroll_student
  FOREIGN KEY (student_id) REFERENCES student(student_id)
  ON DELETE RESTRICT,
  ADD CONSTRAINT fk_enroll_course
  FOREIGN KEY (course_id) REFERENCES course(course_id)
  ON DELETE CASCADE,
  ADD CONSTRAINT uq_enroll_unique
  UNIQUE (student_id, course_id);

ALTER TABLE module
  ADD CONSTRAINT fk_module_course
  FOREIGN KEY (course_id) REFERENCES course(course_id)
  ON DELETE CASCADE;

ALTER TABLE lesson
  ADD CONSTRAINT fk_lesson_module
  FOREIGN KEY (module_id) REFERENCES module(module_id)
  ON DELETE CASCADE;

ALTER TABLE quiz
  ADD CONSTRAINT fk_quiz_module
  FOREIGN KEY (module_id) REFERENCES module(module_id)
  ON DELETE CASCADE;

ALTER TABLE quiz_attempt
  ADD CONSTRAINT fk_attempt_quiz
  FOREIGN KEY (quiz_id) REFERENCES quiz(quiz_id)
  ON DELETE CASCADE,
  ADD CONSTRAINT fk_attempt_student
  FOREIGN KEY (student_id) REFERENCES student(student_id)
  ON DELETE RESTRICT,
  ADD CONSTRAINT uq_attempt_unique
  UNIQUE (quiz_id, student_id, attempt_no);

ALTER TABLE assignment
  ADD CONSTRAINT fk_assignment_module
  FOREIGN KEY (module_id) REFERENCES module(module_id)
  ON DELETE CASCADE;

ALTER TABLE submission
  ADD CONSTRAINT fk_submission_assignment
  FOREIGN KEY (assignment_id) REFERENCES assignment(assignment_id)
  ON DELETE CASCADE,
  ADD CONSTRAINT fk_submission_student
  FOREIGN KEY (student_id) REFERENCES student(student_id)
  ON DELETE RESTRICT,
  ADD CONSTRAINT uq_submission_unique
  UNIQUE (assignment_id, student_id);

ALTER TABLE review
  ADD CONSTRAINT fk_review_student
  FOREIGN KEY (student_id) REFERENCES student(student_id)
  ON DELETE RESTRICT,
  ADD CONSTRAINT fk_review_course
  FOREIGN KEY (course_id) REFERENCES course(course_id)
  ON DELETE CASCADE,
  ADD CONSTRAINT uq_review_unique
  UNIQUE (student_id, course_id);

ALTER TABLE chat_message
  ADD CONSTRAINT fk_chat_course
  FOREIGN KEY (course_id) REFERENCES course(course_id)
  ON DELETE CASCADE,
  ADD CONSTRAINT fk_chat_student
  FOREIGN KEY (student_id) REFERENCES student(student_id)
  ON DELETE SET NULL;


-- Indexes for ordering

CREATE INDEX idx_module_order ON module(course_id, position);
CREATE INDEX idx_lesson_order ON lesson(module_id, position);

ALTER TABLE chat_message
DROP FOREIGN KEY fk_chat_module,
DROP FOREIGN KEY fk_chat_student;