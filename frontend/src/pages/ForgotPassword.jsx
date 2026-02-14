import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setIsLoading(true);

        try {
            const res = await axios.post('http://localhost:5000/api/auth/forgotpassword', { email });
            setMessage('Email sent! Please check your inbox for the reset link.');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
            <div className="bg-white w-full max-w-md p-8 relative overflow-hidden rounded-2xl shadow-xl border border-slate-100">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-secondary"></div>

                <div className="mb-6">
                    <Link to="/login" className="text-slate-500 hover:text-slate-800 flex items-center gap-2 transition-colors text-sm font-medium">
                        <ArrowLeft size={18} />
                        Back to Login
                    </Link>
                </div>

                <h2 className="text-3xl font-bold text-center mb-2 text-slate-900">Forgot Password?</h2>
                <p className="text-slate-500 text-center mb-8">Enter your email and we'll send you a link to reset your password.</p>

                {message && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 px-4 py-3 rounded-lg mb-6 text-sm text-center">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-3 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all shadow-sm"
                                placeholder="name@company.com"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            'Sending...'
                        ) : (
                            <>
                                <Send size={20} />
                                Send Reset Link
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
