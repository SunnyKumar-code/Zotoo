import React, { useRef, useState } from 'react'
import './chatBot.css'

export default function ChatForm({ setChatHistory, generateBotResponse, sendIcon }) {
  const inputRef = useRef();
  const [isTyping, setIsTyping] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return;

    inputRef.current.value = "";
    setIsTyping(false);

    setChatHistory((prevHistory) => {
      const updatedHistory = [...prevHistory, { role: 'user', text: userMessage }];

      generateBotResponse(updatedHistory);

      return updatedHistory;
    });

    setTimeout(() => {
      setChatHistory((prevHistory) => [...prevHistory, { role: 'model', text: 'Thinking...' }]);
    }, 600);
  };

  const handleInputChange = (e) => {
    setIsTyping(e.target.value.trim().length > 0);
  };

  return (
    <form action="#" className='chat-form' onSubmit={handleFormSubmit}>
      <input
        ref={inputRef}
        type='text'
        placeholder='Ask about our menu, delivery options...'
        className="message-input"
        onChange={handleInputChange}
        required
      />
      <button
        type="submit"
        className={`send-button ${isTyping ? 'active' : ''}`}
        aria-label="Send message"
      >
        {sendIcon || "Send"}
      </button>
    </form>
  )
}
