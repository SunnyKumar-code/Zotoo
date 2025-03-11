import React, { useEffect, useRef, useState } from 'react';
import './chatBot.css';
import ChatForm from './ChatForm';
import ChatMessage from './ChatMessage';
import { FaUtensils, FaRobot } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import useScrollLock from '../../hooks/useScrollLock';

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);
    const [initialMessageSent, setInitialMessageSent] = useState(false);

    // Lock scroll when chatbot is open
    useScrollLock(isOpen);

    // Send initial welcome message when chat is opened
    useEffect(() => {
        if (isOpen && !initialMessageSent) {
            const welcomeMessage = {
                text: "Hello! I'm your food assistant. How can I help you today?",
                sender: 'bot',
                timestamp: new Date()
            };
            setChatHistory([welcomeMessage]);
            setInitialMessageSent(true);
        }
    }, [isOpen, initialMessageSent]);

    const toggleChatbot = () => {
        setIsOpen(!isOpen);
    };

    const updateHistory = (text) => {
        const newMessage = { text, sender: 'user', timestamp: new Date() };
        const updatedHistory = [...chatHistory, newMessage];
        setChatHistory(updatedHistory);
        generateBotResponse(updatedHistory);
    };

    const generateBotResponse = async (history) => {
        setIsTyping(true);
        
        // Simulate a delay for typing effect
        setTimeout(() => {
            const lastUserMessage = history[history.length - 1].text.toLowerCase();
            let botResponse = "";

            // Simple rule-based responses
            if (lastUserMessage.includes("hello") || lastUserMessage.includes("hi") || lastUserMessage === "hlo") {
                botResponse = "Hello! How can I help you with your food order today?";
            } else if (lastUserMessage.includes("menu")) {
                botResponse = "We have a variety of dishes including pizzas, burgers, salads, and more. You can check our full menu in the app.";
            } else if (lastUserMessage.includes("delivery") || lastUserMessage.includes("time")) {
                botResponse = "Our typical delivery time is 30-45 minutes depending on your location and order volume.";
            } else if (lastUserMessage.includes("payment") || lastUserMessage.includes("pay")) {
                botResponse = "We accept credit cards, debit cards, and cash on delivery.";
            } else if (lastUserMessage.includes("order") || lastUserMessage.includes("tracking")) {
                botResponse = "You can track your order in real-time through our app once your order is confirmed.";
            } else if (lastUserMessage.includes("thank")) {
                botResponse = "You're welcome! Enjoy your meal and have a great day!";
            } else {
                botResponse = "I'm sorry, I didn't understand that. Can you please rephrase or ask something about our menu, delivery, or payment options?";
            }

            const newBotMessage = { text: botResponse, sender: 'bot', timestamp: new Date() };
            setChatHistory([...history, newBotMessage]);
            setIsTyping(false);
        }, 1500);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory, isTyping]);

    return (
        <div className="chatbot-container">
            {isOpen ? (
                <div className="chatbot-window" ref={chatContainerRef}>
                    <div className="chatbot-header">
                        <div className="chatbot-title">
                            <FaRobot className="chatbot-icon" />
                            <span>Food Assistant</span>
                        </div>
                        <button className="close-button" onClick={toggleChatbot}>
                            <IoMdClose />
                        </button>
                    </div>
                    <div className="chatbot-messages">
                        {chatHistory.map((message, index) => (
                            <ChatMessage
                                key={index}
                                text={message.text}
                                sender={message.sender}
                                timestamp={message.timestamp}
                            />
                        ))}
                        {isTyping && (
                            <div className="typing-indicator">
                                <div className="dot"></div>
                                <div className="dot"></div>
                                <div className="dot"></div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <ChatForm onSubmit={updateHistory} />
                </div>
            ) : (
                <button className="chatbot-button" onClick={toggleChatbot}>
                    <FaUtensils className="chatbot-button-icon" />
                    <span>Chat with us</span>
                </button>
            )}
        </div>
    );
} 