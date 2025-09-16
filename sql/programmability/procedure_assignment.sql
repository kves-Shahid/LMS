DROP PROCEDURE IF EXISTS sp_submit_assignment;

DELIMITER //
CREATE PROCEDURE sp_submit_assignment(
  IN p_assignment_id INT,
  IN p_student_id INT,
  IN p_content_url VARCHAR(255)
)
BEGIN
  IF EXISTS (
    SELECT 1 FROM submission
    WHERE assignment_id = p_assignment_id AND student_id = p_student_id
  ) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Submission already exists';
  ELSE
    INSERT INTO submission(assignment_id, student_id, content_url, submitted_at)
    VALUES (p_assignment_id, p_student_id, p_content_url, NOW());
  END IF;
END //
DELIMITER ;


/*DESCRIBE submission;

ALTER TABLE submission DROP COLUMN score;

ALTER TABLE submission
ADD COLUMN score INT DEFAULT NULL;

DESCRIBE assignment;*/