import React from 'react';
import { Link } from 'react-router-dom';
import { FaComments } from 'react-icons/fa';

const FloatingChatButton = ({ course_id }) => {
  return (
    <Link to={`/chat/${course_id}`} style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: '#007bff',
      color: '#fff',
      borderRadius: '50%',
      padding: '15px',
      fontSize: '24px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
      zIndex: 1000,
    }}>
      <FaComments />
    </Link>
  );
};

export default FloatingChatButton;
