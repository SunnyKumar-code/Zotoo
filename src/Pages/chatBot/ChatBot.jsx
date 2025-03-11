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
    const [apiCallCount, setApiCallCount] = useState(0);
    const [lastApiCallTime, setLastApiCallTime] = useState(0);
    const apiUrl = import.meta.env.VITE_API_URL;

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

    // Helper function to check if we should use the API or fallback to rule-based responses
    const shouldUseApi = () => {
        const now = Date.now();
        const timeSinceLastCall = now - lastApiCallTime;

        // If we've made more than 5 calls in the last minute, use fallback
        if (apiCallCount >= 5 && timeSinceLastCall < 60000) {
            console.log("Rate limiting ourselves to avoid 429 errors");
            return false;
        }

        return true;
    };

    // Helper function to get rule-based response
    const getRuleBasedResponse = (message) => {
        const lastUserMessage = message.toLowerCase();

        if (lastUserMessage.includes("hello") || lastUserMessage.includes("hi") || lastUserMessage === "hlo") {
            return "Hello! How can I help you with your food order today?";
        } else if (lastUserMessage.includes("menu")) {
            return "We have a variety of dishes including pizzas, burgers, salads, and more. You can check our full menu in the app.";
        } else if (lastUserMessage.includes("delivery") || lastUserMessage.includes("time")) {
            return "Our typical delivery time is 30-45 minutes depending on your location and order volume.";
        } else if (lastUserMessage.includes("payment") || lastUserMessage.includes("pay")) {
            return "We accept credit cards, debit cards, and cash on delivery.";
        } else if (lastUserMessage.includes("order") || lastUserMessage.includes("tracking")) {
            return "You can track your order in real-time through our app once your order is confirmed.";
        } else if (lastUserMessage.includes("thank")) {
            return "You're welcome! Enjoy your meal and have a great day!";
        } else {
            return "I'm sorry, I didn't understand that. Can you please rephrase or ask something about our menu, delivery, or payment options?";
        }
    };

    const generateBotResponse = async (history) => {
        setIsTyping(true);
        const lastUserMessage = history[history.length - 1].text;
        let botResponse = "";

        try {
            // Check if we should use the API or fallback to rule-based responses
            if (shouldUseApi()) {
                // Format conversation history for Gemini
                const formattedHistory = history.map(msg => ({
                    role: msg.sender === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.text }]
                }));

                // Add system prompt to guide the AI
                const systemPrompt = {
                    role: 'model',
                    parts: [{
                        text: "You are a helpful food delivery assistant. Provide concise, friendly responses about menu items, delivery times, payment options, and order tracking. Keep responses under 100 words and focused on food delivery topics."
                    }]
                };

                // Prepare the request payload
                const payload = {
                    contents: [systemPrompt, ...formattedHistory],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 150,
                    }
                };

                // Update API call tracking
                setApiCallCount(prevCount => prevCount + 1);
                setLastApiCallTime(Date.now());

                // Make the API call to Gemini with timeout
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

                try {
                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(payload),
                        signal: controller.signal
                    });

                    clearTimeout(timeoutId);

                    if (response.status === 429) {
                        console.warn("Rate limit exceeded (429). Using fallback response.");
                        throw new Error("Rate limit exceeded. Please try again in a moment.");
                    }

                    if (!response.ok) {
                        throw new Error(`API request failed with status ${response.status}`);
                    }

                    const data = await response.json();
                    botResponse = data.candidates[0].content.parts[0].text;

                    // Reset API call count after successful call
                    setTimeout(() => {
                        setApiCallCount(prevCount => Math.max(0, prevCount - 1));
                    }, 60000); // Reduce count after 1 minute
                } catch (fetchError) {
                    if (fetchError.name === 'AbortError') {
                        throw new Error("Request timed out. Using fallback response.");
                    }
                    throw fetchError;
                }
            } else {
                // Use rule-based response if we're rate limiting ourselves
                botResponse = getRuleBasedResponse(lastUserMessage);

                // Add a note that we're using fallback
                botResponse += "\n\n(Using fallback response due to API rate limits)";
            }

            // If we got an empty response, use rule-based fallback
            if (!botResponse || botResponse.trim() === '') {
                botResponse = getRuleBasedResponse(lastUserMessage);
            }
        } catch (error) {
            console.error("Error generating response:", error);

            // Use rule-based fallback response
            botResponse = getRuleBasedResponse(lastUserMessage);

            // If it's a rate limit error, add a note
            if (error.message.includes("Rate limit")) {
                botResponse += "\n\n(Using fallback response due to API rate limits)";
            }
        } finally {
            // Add the bot response to chat history
            const newBotMessage = {
                text: botResponse,
                sender: 'bot',
                timestamp: new Date()
            };
            setChatHistory([...history, newBotMessage]);

            // Always set typing to false when done
            setTimeout(() => {
                setIsTyping(false);
            }, 1000);
        }
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