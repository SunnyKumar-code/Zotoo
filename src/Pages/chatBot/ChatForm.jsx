import React, { useRef } from 'react'
import './chatBot.css'
export default function ChatForm({chatHistory,setChatHistory,generateBotResponse}) {
    const inputRef=useRef()
    const handleFormSubmit = (e) => {
        e.preventDefault(); 
        const userMessage = inputRef.current.value.trim();
        if (!userMessage) return;
        
        inputRef.current.value = "";
    
        
        setChatHistory((prevHistory) => {
            const updatedHistory = [...prevHistory, { role: 'user', text: userMessage }];
            
            
            generateBotResponse(updatedHistory);
    
            return updatedHistory;
        });
    
        setTimeout(() => {
            setChatHistory((prevHistory) => [...prevHistory, { role: 'model', text: 'Thinking...' }]);
        }, 600);
    };
    
  return (
    <form action="#" className='chat-form' onSubmit={handleFormSubmit}>
    <input ref={inputRef} type='text' placeholder='Message...' className="message-input" required></input>
    <button className="material-symbols-rounded">send</button>
</form>
  )
}
