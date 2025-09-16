

DROP TRIGGER IF EXISTS trg_sanitize_chat_message;
DELIMITER //
CREATE TRIGGER trg_sanitize_chat_message
BEFORE INSERT ON chat_message
FOR EACH ROW
BEGIN
 
  SET NEW.message = REPLACE(NEW.message, 'badword', '[censored]');
  SET NEW.message = REPLACE(NEW.message, 'uglyword', '[censored]');
 
END;
//
DELIMITER ;
