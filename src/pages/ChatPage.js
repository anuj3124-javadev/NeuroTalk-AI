import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import Navbar from '../components/Navbar';
import api from '../services/api';
import '../styles/chat.css';
import '../styles/sidebar.css';

const ChatPage = () => {
    const [currentChatId, setCurrentChatId] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false); // for mobile

    // Load chats on mount and set current chat
    useEffect(() => {
        const initializeChat = async () => {
            try {
                const response = await api.get('/chats');
                const chats = response.data;
                if (chats.length > 0) {
                    // Select the most recent chat (first in list)
                    setCurrentChatId(chats[0].id);
                } else {
                    // No chats, create one automatically
                    const newChat = await api.post('/chats', { title: 'New Chat' });
                    setCurrentChatId(newChat.data.id);
                }
            } catch (error) {
                console.error('Failed to initialize chat', error);
            }
        };
        initializeChat();
    }, []);

    const handleNewChat = async () => {
        try {
            const response = await api.post('/chats', { title: 'New Chat' });
            setCurrentChatId(response.data.id);
            setSidebarOpen(false); // close sidebar on mobile after creating new chat
        } catch (error) {
            console.error('Failed to create new chat', error);
        }
    };

    const handleSelectChat = (chatId) => {
        setCurrentChatId(chatId);
        setSidebarOpen(false); // close sidebar on mobile after selection
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="app-container">
            <Navbar toggleSidebar={toggleSidebar} />
            <div className="main-layout">
                <Sidebar
                    currentChatId={currentChatId}
                    onSelectChat={handleSelectChat}
                    onNewChat={handleNewChat}
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />
                <ChatWindow chatId={currentChatId} />
                {/* Mobile overlay when sidebar is open */}
                {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}
            </div>
        </div>
    );
};

export default ChatPage;