import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Sidebar = ({ currentChatId, onSelectChat, onNewChat, isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchChats = async () => {
        setLoading(true);
        try {
            const response = await api.get('/chats');
            setChats(response.data);
        } catch (error) {
            console.error('Failed to fetch chats', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChats();
    }, []);

    const handleDelete = async (chatId, e) => {
        e.stopPropagation();
        if (!window.confirm('Delete this chat?')) return;
        try {
            await api.delete(`/chats/${chatId}`);
            setChats(chats.filter(c => c.id !== chatId));
            if (currentChatId === chatId) {
                onSelectChat(null);
            }
        } catch (error) {
            alert('Failed to delete chat');
        }
    };

    return (
        <>
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <button className="new-chat-btn" onClick={onNewChat}>+ New Chat</button>
                <div className="chats-list">
                    {loading && <div className="loader">Loading...</div>}
                    {!loading && chats.length === 0 && (
                        <div className="no-chats">No chats yet</div>
                    )}
                    {chats.map(chat => (
                        <div
                            key={chat.id}
                            className={`chat-item ${currentChatId === chat.id ? 'active' : ''}`}
                            onClick={() => onSelectChat(chat.id)}
                        >
                            <span className="chat-title">{chat.title}</span>
                            <button className="delete-chat" onClick={(e) => handleDelete(chat.id, e)}>×</button>
                        </div>
                    ))}
                </div>
                {/* User info at bottom - visible only on mobile */}
                <div className="sidebar-user">
                    <span className="user-name">{user?.name}</span>
                    <button onClick={logout} className="logout-btn">Logout</button>
                </div>
            </div>
            {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
        </>
    );
};

export default Sidebar;