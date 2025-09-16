DELIMITER //

CREATE PROCEDURE sp_publish_full_course(
  IN p_instructor_id INT,
  IN p_course_title VARCHAR(100),
  IN p_description TEXT,
  IN p_category VARCHAR(50),
  IN p_language VARCHAR(50),
  IN p_price DECIMAL(8,2),
  IN p_module_title_1 VARCHAR(100),
  IN p_lesson_title_1 VARCHAR(100),
  IN p_lesson_resource_1 TEXT
)
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Transaction failed - course creation rolled back';
  END;

  START TRANSACTION;

  INSERT INTO course (
    instructor_id, title, description, category, language, price, status, created_at
  ) VALUES (
    p_instructor_id, p_course_title, p_description, p_category, p_language, p_price,
    'draft', NOW()
  );

  SET @course_id := LAST_INSERT_ID();

  INSERT INTO module (
    course_id, title, created_at
  ) VALUES (
    @course_id, p_module_title_1, NOW()
  );

  SET @module_id := LAST_INSERT_ID();

  INSERT INTO lesson (
    module_id, title, resource, created_at
  ) VALUES (
    @module_id, p_lesson_title_1, p_lesson_resource_1, NOW()
  );

  UPDATE course
  SET status = 'published'
  WHERE course_id = @course_id;

  COMMIT;
END //

DELIMITER ;
