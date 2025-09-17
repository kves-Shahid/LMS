import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom"; 
import axiosInstance from "../services/axiosInstance"; 
import "./ChatPage.css"; 

const ChatPage = () => {
  const { course_id } = useParams(); 
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const userRole = localStorage.getItem("userRole"); 
  const userId = localStorage.getItem(userRole === "student" ? "student_id" : "instructor_id"); 
  const messagesEndRef = useRef(null);

  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  
  useEffect(() => {
    axiosInstance.get(`/chat/course/${course_id}`)
      .then((response) => {
        setMessages(response.data); 
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  }, [course_id]);

  
  useEffect(() => {
    const interval = setInterval(() => {
      axiosInstance.get(`/chat/course/${course_id}`)
        .then((response) => {
          setMessages(response.data); 
        })
        .catch((error) => {
          console.error("Error fetching messages:", error);
        });
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [course_id]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const payload = {
      course_id: course_id, 
      message: message,
    };

    if (userRole === "student") {
      payload.student_id = userId;
    } else if (userRole === "instructor") {
      payload.instructor_id = userId;
    }

    
    axiosInstance.post("/chat/send", payload)
      .then((response) => {
       
        setMessages([...messages, { 
          message, 
          sender: userRole,
         
          tempId: Date.now() 
        }]);
        setMessage(""); 
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  };

 
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container">
      <h2>Chat for Course {course_id}</h2>
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div 
            key={msg.id || msg.tempId || index} 
            className={`message ${msg.sender === userRole ? 'sent' : 'received'}`}
          >
            <div className="message-content">
              <p>{msg.message}</p>
              <span className="message-sender">{msg.sender}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="message-input"
        />
        <button onClick={handleSendMessage} className="send-button">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;