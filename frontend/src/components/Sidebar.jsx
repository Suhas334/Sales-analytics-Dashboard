import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Upload, BarChart3, FileText, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { logout, user } = useAuth();

    const navItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/upload', icon: Upload, label: 'Upload Sales', roles: ['admin'] },
        { path: '/analysis', icon: BarChart3, label: 'Analytics' },
        { path: '/reports', icon: FileText, label: 'Reports & Filters' },
        { path: '/profile', icon: User, label: 'Profile' },
    ].filter(item => !item.roles || item.roles.includes(user?.role));

    const [isHelpOpen, setIsHelpOpen] = React.useState(false);

    const HelpModal = () => (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3 text-primary">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <BarChart3 size={24} className="text-primary" />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl text-slate-900">SalesFlow</h3>
                            <p className="text-xs text-slate-500 font-medium tracking-wide">VERSION 1.0.0</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsHelpOpen(false)}
                        className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                    >
                        <LogOut size={20} className="rotate-45" /> {/* Using LogOut as close icon for simplicity or add X icon if available */}
                    </button>
                </div>

                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    SalesFlow is a web-based sales analytics dashboard that helps organizations upload, analyze, and visualize sales data through interactive reports and dashboards.
                </p>

                <div className="space-y-4">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <h4 className="font-semibold text-slate-900 text-sm mb-2">User Roles</h4>
                        <ul className="text-xs text-slate-600 space-y-1.5">
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                <b>Admin:</b> Uploads data and manages analytics
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                <b>Sales Manager:</b> Views analytics and reports
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                    <button
                        onClick={() => setIsHelpOpen(false)}
                        className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <aside className="w-64 h-screen fixed left-0 top-0 bg-white border-r border-slate-200 flex flex-col z-50">
                <div className="p-6 mb-2">
                    <div className="flex items-center gap-2 text-primary mb-1">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <BarChart3 size={20} className="text-primary" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-slate-900">SalesFlow</span>
                    </div>
                    <p className="text-xs text-slate-500 pl-10 font-medium tracking-wide">ANALYTICS PRO</p>
                </div>

                <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                                    ? 'bg-primary/5 text-primary font-semibold border-l-2 border-primary'
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 border-l-2 border-transparent'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon size={18} className={isActive ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600'} />
                                    <span className="text-sm">{item.label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}

                    {/* Help Button */}
                    <button
                        onClick={() => setIsHelpOpen(true)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group text-slate-500 hover:text-slate-900 hover:bg-slate-50 border-l-2 border-transparent text-left"
                    >
                        <FileText size={18} className="text-slate-400 group-hover:text-slate-600" />
                        <span className="text-sm">About & Help</span>
                    </button>
                </nav>

                <div className="p-4 border-t border-slate-200">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-default mb-2">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-sm text-white shadow-sm">
                            {user?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">{user?.name || 'User'}</p>
                            <p className="text-xs text-slate-500 capitalize truncate">{user?.role || 'Member'}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-slate-500 hover:text-red-500 transition-colors uppercase tracking-wider"
                    >
                        <LogOut size={14} />
                        Sign Out
                    </button>
                </div>
            </aside>
            {isHelpOpen && <HelpModal />}
        </>
    );
};

export default Sidebar;
