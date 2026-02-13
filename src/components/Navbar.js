import React from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ toggleSidebar }) => {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <button className="mobile-menu-btn" onClick={toggleSidebar}>
                    ☰
                </button>
                <div className="navbar-brand">🧠 NeuroTalk AI</div>
            </div>
            <div className="navbar-user">
                <span className="desktop-username">{user?.name}</span>
                <button onClick={logout} className="logout-btn">Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;