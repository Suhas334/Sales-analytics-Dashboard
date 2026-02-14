import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                // Set default header for axios so all requests include the token
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                try {
                    const storedUser = JSON.parse(localStorage.getItem('user'));
                    if (storedUser) setUser(storedUser);
                } catch (error) {
                    localStorage.removeItem('token');
                    delete axios.defaults.headers.common['Authorization'];
                }
            }
            setLoading(false);
        };
        checkLoggedIn();
    }, []);

    // Interceptor to handle expired tokens
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            response => response,
            error => {
                if (error.response && error.response.status === 401) {
                    logout();
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, []);

    const login = async (email, password) => {
        const res = await axios.post('/api/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        setUser(res.data.user);
    };

    const register = async (name, email, password, role) => {
        await axios.post('/api/auth/register', { name, email, password, role });
        // Optional: auto login after register
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
