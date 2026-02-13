import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import Navbar from '../components/Navbar';
import api from '../services/api';
import '../styles/chat.css';
import '../styles/sidebar.css';

const ChatPage = () => {
    const [currentChatId, setCurrentChatId] = useState(null);

    const handleNewChat = async () => {
        try {
            const response = await api.post('/chats', { title: 'New Chat' });
            setCurrentChatId(response.data.id);
        } catch (error) {
            console.error('Failed to create new chat', error);
        }
    };

    const handleSelectChat = (chatId) => {
        setCurrentChatId(chatId);
    };

    return (
        <div className="app-container">
            <Navbar />
            <div className="main-layout">
                <Sidebar
                    currentChatId={currentChatId}
                    onSelectChat={handleSelectChat}
                    onNewChat={handleNewChat}
                />
                <ChatWindow chatId={currentChatId} />
            </div>
        </div>
    );
};

export default ChatPage;