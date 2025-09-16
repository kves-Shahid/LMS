
DROP TRIGGER IF EXISTS trg_update_course_rating;
DELIMITER //
CREATE TRIGGER trg_update_course_rating
AFTER INSERT ON review
FOR EACH ROW
BEGIN
  UPDATE course
  SET average_rating = (
    SELECT ROUND(AVG(r.rating), 2)
    FROM review r
    WHERE r.course_id = NEW.course_id
  )
  WHERE course.course_id = NEW.course_id;
END;
//
DELIMITER ;
