import React from 'react';
import { BarChart, TrendingUp, PieChart, Activity, ShieldCheck } from 'lucide-react';

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen flex bg-slate-50 font-sans">
            {/* Left Side - Form Container */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative bg-white">
                {/* Mobile Background Decoration */}
                <div className="lg:hidden absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-600 to-violet-600"></div>

                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
                        {subtitle && <p className="mt-2 text-slate-500">{subtitle}</p>}
                    </div>

                    {children}
                </div>

                {/* Mobile Logo (Top Left) */}
                <div className="lg:hidden absolute top-6 left-6 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center shadow-md">
                        <BarChart className="text-white" size={18} />
                    </div>
                    <span className="font-bold text-slate-900">SalesFlow</span>
                </div>
            </div>

            {/* Right Side - Visual Panel (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden flex-col justify-between p-12 text-white">
                {/* Background Decorations */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600 rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-600 rounded-full blur-[100px] opacity-20 translate-y-1/3 -translate-x-1/4"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>

                {/* Logo Area */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-white/10">
                        <BarChart className="text-white" size={24} />
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-white">SalesFlow</span>
                </div>

                {/* Main Visual Content */}
                <div className="relative z-10 space-y-8">
                    <h1 className="text-5xl font-bold leading-tight">
                        Transform data into <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
                            actionable insights.
                        </span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-md leading-relaxed">
                        Join thousands of sales managers who are optimizing their performance with our advanced analytics platform.
                        Track revenue, analyze trends, and grow your business.
                    </p>

                    {/* Floating Cards Visualization */}
                    <div className="relative h-48 w-full max-w-md mt-12">
                        {/* Card 1 */}
                        <div className="absolute top-0 left-0 bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl w-48 animate-float-slow">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-indigo-500/20 rounded-lg">
                                    <TrendingUp size={18} className="text-indigo-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-300">Total Revenue</p>
                                    <p className="font-bold text-white">$124,500</p>
                                </div>
                            </div>
                            <div className="h-1.5 w-full bg-slate-700/50 rounded-full overflow-hidden">
                                <div className="h-full w-[75%] bg-indigo-500 rounded-full"></div>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="absolute bottom-0 right-0 bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl w-48 animate-float-delayed">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-violet-500/20 rounded-lg">
                                    <Activity size={18} className="text-violet-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-300">Active Users</p>
                                    <p className="font-bold text-white">1,204</p>
                                </div>
                            </div>
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-6 h-6 rounded-full bg-slate-600 border border-slate-800"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer/Trust */}
                <div className="relative z-10 flex items-center gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={16} className="text-indigo-400" />
                        <span>Enterprise Grade Security</span>
                    </div>
                    <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                    <span>99.9% Uptime</span>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
