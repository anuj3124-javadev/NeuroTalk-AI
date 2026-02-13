import React from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="navbar-brand">🧠 NeuroTalk AI</div>
            <div className="navbar-user">
                <span>{user?.name}</span>
                <button onClick={logout} className="logout-btn">Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;