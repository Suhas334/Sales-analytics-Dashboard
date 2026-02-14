import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import AuthLayout from '../layout/AuthLayout';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600 rounded-full blur-[120px] opacity-10 -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-600 rounded-full blur-[100px] opacity-10 translate-y-1/2 -translate-x-1/2"></div>

            <div className="bg-white w-full max-w-md p-8 relative rounded-2xl shadow-xl border border-slate-200 z-10">
                {/* Branding */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl shadow-lg shadow-indigo-500/20 mb-3">
                        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="20" x2="12" y2="10"></line>
                            <line x1="18" y1="20" x2="18" y2="4"></line>
                            <line x1="6" y1="20" x2="6" y2="16"></line>
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">SalesFlow</h1>
                    <p className="text-slate-500 text-sm mt-1">Sign in to your dashboard</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-center gap-2 animate-pulse">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-slate-700 font-semibold mb-1.5 text-sm">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                            <input
                                type="email"
                                name="email"
                                placeholder="name@company.com"
                                className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all shadow-sm"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between mb-1.5">
                            <label className="block text-slate-700 font-semibold text-sm">Password</label>
                            <Link to="/forgot-password" class="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
                                Forgot Password?
                            </Link>
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all shadow-sm"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-br from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    >
                        <LogIn size={20} />
                        Sign In
                    </button>
                </form>

                <p className="text-slate-500 text-center mt-8 text-sm">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
