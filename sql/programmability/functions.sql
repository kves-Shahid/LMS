
DELIMITER //
CREATE FUNCTION fn_student_full_name(sid INT)
RETURNS VARCHAR(150)
DETERMINISTIC
BEGIN
  DECLARE result VARCHAR(150);
  SELECT CONCAT(f_name, ' ', l_name) INTO result FROM student WHERE student_id = sid;
  RETURN result;
END //
DELIMITER ;


DELIMITER //
CREATE FUNCTION fn_instructor_name(iid INT)
RETURNS VARCHAR(100)
DETERMINISTIC
BEGIN
  DECLARE result VARCHAR(100);
  SELECT full_name INTO result FROM instructor WHERE instructor_id = iid;
  RETURN result;
END //
DELIMITER ;







