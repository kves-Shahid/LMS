
-- Enroll a student into a course

DELIMITER //
CREATE PROCEDURE sp_enroll_student(IN p_student_id INT, IN p_course_id INT)
BEGIN
  IF EXISTS (
    SELECT 1 FROM enrollment 
    WHERE student_id = p_student_id AND course_id = p_course_id
  ) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Student already enrolled in course';
  ELSE
    INSERT INTO enrollment(student_id, course_id)
    VALUES (p_student_id, p_course_id);
  END IF;
END //
DELIMITER ;


DROP PROCEDURE IF EXISTS sp_enroll_student;