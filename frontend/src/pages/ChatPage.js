import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; 
import axiosInstance from "../services/axiosInstance"; 

const ChatPage = () => {
  const { course_id } = useParams(); 
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const userRole = localStorage.getItem("userRole"); 
  const userId = localStorage.getItem(userRole === "student" ? "student_id" : "instructor_id"); 

  
  useEffect(() => {
    axiosInstance.get(`/chat/course/${course_id}`)
      .then((response) => {
        setMessages(response.data); 
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
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

    // Send the message via axiosInstance
    axiosInstance.post("/chat/send", payload)
      .then((response) => {
        setMessages([...messages, { message, sender: userRole }]);
        setMessage(""); 
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  };

  return (
    <div>
      <h2>Chat for Course {course_id}</h2>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <p><strong>{msg.sender}</strong>: {msg.message}</p>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default ChatPage;
