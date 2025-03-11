import React, { useEffect, useRef, useState } from 'react';
import './chatBot.css';
import ChatForm from './ChatForm';
import ChatMessage from './ChatMessage';
import { FaUtensils, FaRobot, FaPaperPlane } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import useScrollLock from '../../hooks/useScrollLock';

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const chatBodyRef = useRef();
    
    // Lock scroll when chatbot is open on mobile devices
    useScrollLock(isOpen && window.innerWidth <= 768);

    const toggleChatbot = () => {
        setIsOpen(!isOpen);
    };

    const updateHistory = (text) => {
        setChatHistory(prev => [
            ...prev.filter(msg => msg.text !== "Thinking..."),
            { role: "model", text }
        ]);
    };

    const generateBotResponse = async (history) => {
        history = history.map(({ role, text }) => ({ role, parts: [{ text }] }));
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: history })
        };
        try {
            const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
            const data = await response.json();
            if (!response.ok) throw new Error(data.error.message || "Something went wrong!");
            const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
            updateHistory(apiResponseText);
        } catch (err) {
            console.log(err);
            updateHistory("Sorry, I'm having trouble connecting right now. Please try again later.");
        }
    };

    // Scroll to bottom whenever chat history changes
    useEffect(() => {
        scrollToBottom();
    }, [chatHistory]);

    // Scroll to bottom when chat is opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(scrollToBottom, 300); // Add delay to ensure animation completes
        }
    }, [isOpen]);

    const scrollToBottom = () => {
        if (chatBodyRef.current) {
            const scrollHeight = chatBodyRef.current.scrollHeight;
            const height = chatBodyRef.current.clientHeight;
            const maxScrollTop = scrollHeight - height;
            
            chatBodyRef.current.scrollTo({
                top: maxScrollTop,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className='chat-container'>
            {!isOpen && (
                <button className="chat-toggle-btn" onClick={toggleChatbot} aria-label="Open chat assistant">
                    <FaRobot size={24} />
                </button>
            )}

            {isOpen && (
                <div className={`chatbot-popup ${isOpen ? 'open' : ''}`}>
                    <div className="chat-header">
                        <div className="header-info">
                            <FaUtensils size={20} />
                            <h2 className="logo-text">Food Assistant</h2>
                        </div>
                        <button onClick={toggleChatbot} aria-label="Close chat">
                            <IoMdClose size={24} />
                        </button>
                    </div>
                    <div ref={chatBodyRef} className="chat-body">
                        <div className="message bot-message">
                            <FaRobot size={24} />
                            <p className="message-text">
                                Hello! I'm your food assistant. How can I help you today? You can ask me about menu items, delivery options, or special offers.
                            </p>
                        </div>
                        {chatHistory.map((chat, index) => (
                            <ChatMessage key={index} chat={chat} />
                        ))}
                        <div className="scroll-anchor" />
                    </div>
                    <div className="chat-footer">
                        <ChatForm 
                            setChatHistory={setChatHistory} 
                            generateBotResponse={generateBotResponse} 
                            sendIcon={<FaPaperPlane size={16} />}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
