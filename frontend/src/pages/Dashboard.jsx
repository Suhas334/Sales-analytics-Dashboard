import React, { useEffect, useState } from 'react';
import { DollarSign, ShoppingBag, Box, ArrowUpRight } from 'lucide-react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 relative overflow-hidden group hover:border-blue-300 transition-colors">
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{title}</p>
                <h3 className="text-3xl font-bold mt-2 text-slate-900">{value}</h3>
            </div>
            <div className={`p-2 rounded-lg bg-slate-50 ${color.replace('text-', 'text-')} group-hover:scale-110 transition-transform`}>
                <Icon size={20} className={color} />
            </div>
        </div>

        {trend && (
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-xs font-bold border border-emerald-100">
                    <ArrowUpRight size={12} />
                    <span>{trend}</span>
                </div>
                <span className="text-slate-400 text-xs font-medium">vs last month</span>
            </div>
        )}
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({ total_revenue: 0, total_orders: 0, total_quantity: 0 });
    const [categoryData, setCategoryData] = useState({ labels: [], datasets: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/sales/stats', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(res.data.summary);

            // Transform category data for chart
            const cats = res.data.category.map(c => c.category);
            const vals = res.data.category.map(c => c.sales);
            setCategoryData({
                labels: cats,
                datasets: [{
                    data: vals,
                    backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
                    borderWidth: 0
                }]
            });

            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    if (loading) return <div className="text-slate-500">Loading...</div>;

    return (
        <div className="space-y-6 text-slate-900">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>
                    <p className="text-slate-500 mt-1">Overview of your sales performance</p>
                </div>
                <button
                    onClick={fetchStats}
                    className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                    Refresh Data
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Revenue"
                    value={`$${(stats?.total_revenue || 0).toLocaleString()}`}
                    icon={DollarSign}
                    color="text-emerald-500"
                    trend="+12.5%"
                />
                <StatCard
                    title="Total Orders"
                    value={(stats?.total_orders || 0).toLocaleString()}
                    icon={ShoppingBag}
                    color="text-blue-500"
                    trend="+8.2%"
                />
                <StatCard
                    title="Items Sold"
                    value={(stats?.total_quantity || 0).toLocaleString()}
                    icon={Box}
                    color="text-purple-500"
                    trend="+5.3%"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-6 text-slate-900">Sales by Category</h3>
                    <div className="h-64 flex items-center justify-center">
                        {categoryData?.labels?.length > 0 ? (
                            <Doughnut data={categoryData} options={{ maintainAspectRatio: false }} />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-slate-400">
                                <Box size={32} className="mb-2 text-slate-300" />
                                <p>No data available</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                        <Box className="text-blue-500" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Welcome to SalesFlow</h3>
                    <p className="text-slate-500 max-w-sm">
                        Upload your CSV data to generate detailed analytics and reports.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
