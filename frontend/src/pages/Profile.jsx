import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Activity, CheckCircle, Save, X, Loader, Clock, Shield, Upload as UploadIcon, FileText, Download, DollarSign } from 'lucide-react';
import axios from 'axios';

const Profile = () => {
    const { user, logout } = useAuth();

    // Local state for edit mode
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', email: '' });
    const [updating, setUpdating] = useState(false);

    // Real metrics state
    const [metrics, setMetrics] = useState({
        orders: 0,
        uploads: 0,
        revenue: 0,
        loading: true
    });

    // Initialize form when entering edit mode or when user data loads
    useEffect(() => {
        if (user) {
            setEditForm({ name: user.name || '', email: user.email || '' });
        }
    }, [user]);

    // Fetch real metrics
    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const headers = { Authorization: `Bearer ${token}` };

                // Fetch Stats (Total Orders)
                const statsRes = await axios.get('/api/sales/stats', { headers });

                // Fetch Uploads (only if admin)
                let uploadsCount = 0;
                if (user?.role === 'admin') {
                    try {
                        const uploadsRes = await axios.get('/api/sales/uploads', { headers });
                        uploadsCount = uploadsRes.data.length;
                    } catch (e) {
                        console.warn("Could not fetch uploads", e);
                    }
                }

                setMetrics({
                    orders: statsRes.data.summary.total_orders || 0,
                    uploads: uploadsCount,
                    revenue: statsRes.data.summary.total_revenue || 0,
                    loading: false
                });

            } catch (err) {
                console.error("Error fetching metrics", err);
                setMetrics(prev => ({ ...prev, loading: false }));
            }
        };

        if (user) {
            fetchMetrics();
        }
    }, [user]);

    const handleUpdateProfile = async () => {
        setUpdating(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put('/api/auth/profile', editForm, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update local storage
            const updatedUser = { ...user, ...res.data };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            // Reload to refresh context
            window.location.reload();

        } catch (err) {
            console.error(err);
            alert('Failed to update profile. Please try again.');
        } finally {
            setUpdating(false);
            setIsEditing(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-slate-900">My Profile</h2>
                <p className="text-slate-500 mt-1">Manage your account and view activity</p>
            </div>

            {/* Main Identity Card */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-8 flex flex-col md:flex-row items-center gap-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg shrink-0">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>

                {isEditing ? (
                    <div className="flex-1 w-full space-y-4 max-w-md">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Full Name</label>
                            <input
                                type="text"
                                value={editForm.name}
                                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Email Address</label>
                            <input
                                type="email"
                                value={editForm.email}
                                readOnly
                                className="w-full p-2 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg outline-none cursor-not-allowed"
                                title="Email cannot be changed"
                            />
                        </div>
                        <div className="flex gap-2 pt-2">
                            <button
                                onClick={handleUpdateProfile}
                                disabled={updating}
                                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center gap-2 transition-colors disabled:opacity-70"
                            >
                                {updating ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
                                Save Changes
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                disabled={updating}
                                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2 transition-colors"
                            >
                                <X size={16} />
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 text-center md:text-left space-y-2">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900">{user?.name || 'User'}</h3>
                            <p className="text-slate-500">{user?.email || 'user@example.com'}</p>
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-3">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                <CheckCircle size={12} />
                                Status: Active
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                                <Shield size={12} />
                                {user?.role || 'Member'}
                            </span>
                        </div>
                    </div>
                )}

                {!isEditing && (
                    <div className="md:border-l md:border-slate-100 md:pl-8 flex flex-col gap-3 min-w-[200px]">
                        <button
                            onClick={logout}
                            className="w-full py-2.5 px-4 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors text-sm"
                        >
                            Sign Out
                        </button>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="w-full py-2.5 px-4 bg-slate-900 text-white hover:bg-slate-800 rounded-lg font-medium transition-colors text-sm shadow-sm"
                        >
                            Edit Profile
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Account Summary */}
                <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                        <User size={20} className="text-slate-400" />
                        <h4 className="font-bold text-slate-900">Account Summary</h4>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-slate-500">Member Since</span>
                            <span className="text-sm font-medium text-slate-900">January 2026</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-t border-slate-50">
                            <span className="text-sm text-slate-500">Last Login</span>
                            <span className="text-sm font-medium text-slate-900">
                                {user?.last_login ? new Date(user.last_login).toLocaleString() : 'Just now'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-t border-slate-50">
                            <span className="text-sm text-slate-500">Account Type</span>
                            <span className="text-sm font-medium text-slate-900">Standard License</span>
                        </div>
                    </div>
                </div>

                {/* Usage Metrics (Real Data) */}
                <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                        <Activity size={20} className="text-slate-400" />
                        <h4 className="font-bold text-slate-900">Usage Metrics</h4>
                    </div>

                    {metrics.loading ? (
                        <div className="flex items-center justify-center py-8 text-slate-400">
                            <Loader className="animate-spin" size={24} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                <p className="text-xs text-slate-500 uppercase font-semibold flex items-center gap-1.5">
                                    <FileText size={14} /> Total Orders
                                </p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{metrics.orders.toLocaleString()}</p>
                            </div>

                            {user?.role === 'admin' ? (
                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                    <p className="text-xs text-slate-500 uppercase font-semibold flex items-center gap-1.5">
                                        <UploadIcon size={14} /> Total Uploads
                                    </p>
                                    <p className="text-2xl font-bold text-slate-900 mt-1">{metrics.uploads.toLocaleString()}</p>
                                </div>
                            ) : (
                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                    <p className="text-xs text-slate-500 uppercase font-semibold flex items-center gap-1.5">
                                        <DollarSign size={14} /> Total Revenue
                                    </p>
                                    <p className="text-2xl font-bold text-slate-900 mt-1">
                                        ${metrics.revenue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
