-- Drop old trigger if exists
DROP TRIGGER IF EXISTS trg_validate_submission_score;

DELIMITER //

CREATE TRIGGER trg_validate_submission_score
BEFORE INSERT ON submission
FOR EACH ROW
BEGIN
  DECLARE max_allowed INT;

  -- Only check score if it's provided
  IF NEW.score IS NOT NULL THEN
    SELECT max_score INTO max_allowed
    FROM assignment
    WHERE assignment_id = NEW.assignment_id;

    IF NEW.score < 0 OR NEW.score > max_allowed THEN
      SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Invalid score: must be between 0 and max_score of assignment';
    END IF;
  END IF;
END;
//

DELIMITER ;


SHOW TRIGGERS LIKE 'submission';

select * from submission;

ALTER TABLE submission
MODIFY COLUMN score INT DEFAULT NULL;