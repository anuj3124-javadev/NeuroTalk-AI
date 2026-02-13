import React, { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import api from '../services/api';

const ChatWindow = ({ chatId }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await api.get(`/chats/${chatId}`);
                setMessages(response.data.messages);
            } catch (error) {
                console.error('Failed to load messages', error);
            }
        };

        if (chatId) {
            fetchMessages();
        } else {
            setMessages([]);
        }
    }, [chatId]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || !chatId) return;

        const userMessage = input.trim();
        setInput('');
        // Optimistically add user message
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);

        try {
            const response = await api.post(`/chats/${chatId}/messages`, { content: userMessage });
            // Add AI response from server
            setMessages(prev => [...prev, response.data.assistantMessage]);
        } catch (error) {
            console.error('Failed to send message', error);
            // Optionally show error
            setMessages(prev => prev.filter(m => m.content !== userMessage)); // remove optimistic
            alert('Failed to get response. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend(e);
        }
    };

    if (!chatId) {
        return (
            <div className="chat-window empty">
                <h2>Start a new conversation</h2>
                <p>Click "New Chat" to begin</p>
            </div>
        );
    }

    return (
        <div className="chat-window">
            <div className="messages-container">
                {messages.map((msg, idx) => (
                    <MessageBubble key={idx} role={msg.role} content={msg.content} />
                ))}
                {loading && (
                    <div className="typing-indicator">
                        <span></span><span></span><span></span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <form className="input-form" onSubmit={handleSend}>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    rows={1}
                />
                <button type="submit" disabled={!input.trim() || loading}>Send</button>
            </form>
        </div>
    );
};

export default ChatWindow;