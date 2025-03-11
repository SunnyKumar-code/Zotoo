import React from 'react'
import './chatBot.css'
import { FaRobot, FaUser } from 'react-icons/fa'

export default function ChatMessage({ chat }) {
    return (
        <div className={`message ${chat.role === "model" ? 'bot' : 'user'}-message`}>
            {chat.role === "model" && <FaRobot size={24} />}
            {chat.role === "user" && <div className="user-icon"><FaUser size={14} /></div>}
            <p className="message-text">
                {chat.text}
            </p>
        </div>
    )
} 