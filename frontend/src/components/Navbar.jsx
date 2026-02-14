import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };


    return (
        <nav className="bg-white shadow-sm border-b border-slate-200">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    <Link to="/" className="text-xl font-bold text-primary">SalesAnalytics</Link>
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <Link to="/" className="text-slate-600 hover:text-primary font-medium transition-colors">Dashboard</Link>
                                <Link to="/upload" className="text-slate-600 hover:text-primary font-medium transition-colors">Upload Data</Link>
                                <span className="text-slate-400 text-sm">Welcome, {user.name}</span>
                                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors shadow-sm">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-slate-600 hover:text-primary font-medium transition-colors">Login</Link>
                                <Link to="/register" className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-primary/30">Register</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
