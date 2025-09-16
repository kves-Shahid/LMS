
-- Record a quiz attempt

DELIMITER //
CREATE PROCEDURE sp_submit_quiz_attempt(
  IN p_quiz_id INT,
  IN p_student_id INT,
  IN p_score DECIMAL(5,2),
  IN p_attempt_no INT
)
BEGIN
  IF EXISTS (
    SELECT 1 FROM quiz_attempt
    WHERE quiz_id = p_quiz_id AND student_id = p_student_id AND attempt_no = p_attempt_no
  ) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Attempt already exists';
  ELSE
    INSERT INTO quiz_attempt(quiz_id, student_id, score, attempt_no)
    VALUES (p_quiz_id, p_student_id, p_score, p_attempt_no);
  END IF;
END //
DELIMITER ;


DROP PROCEDURE IF EXISTS sp_submit_quiz_attempt;