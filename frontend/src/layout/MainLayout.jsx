import React from 'react';
import Sidebar from '../components/Sidebar';

const MainLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <Sidebar />
            <main className="pl-64 min-h-screen relative z-10">
                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
