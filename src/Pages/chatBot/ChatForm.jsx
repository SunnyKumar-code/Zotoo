import React, { useRef, useState } from 'react'
import './chatBot.css'
import { FaPaperPlane } from 'react-icons/fa';

export default function ChatForm({ onSubmit }) {
  const inputRef = useRef();
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() === '') return;

    onSubmit(message);
    setMessage('');
    inputRef.current.focus();
  };

  return (
    <form className="chatbot-form" onSubmit={handleSubmit}>
      <input
        type="text"
        ref={inputRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="chatbot-input"
        autoFocus
      />
      <button type="submit" className="send-button" disabled={message.trim() === ''}>
        <FaPaperPlane />
      </button>
    </form>
  );
}
