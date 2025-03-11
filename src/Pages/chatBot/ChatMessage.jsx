import React from 'react'
import './chatBot.css'
import { FaRobot, FaUser } from 'react-icons/fa'

export default function ChatMessage({ text, sender, timestamp }) {
    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className={`chat-message ${sender === 'bot' ? 'bot' : 'user'}`}>
            <div className="message-avatar">
                {sender === 'bot' ? <FaRobot size={16} /> : <FaUser size={14} />}
            </div>
            <div className="message-content">
                <div className="message-text">{text}</div>
                <div className="message-time">{formatTime(timestamp)}</div>
            </div>
        </div>
    );
} 