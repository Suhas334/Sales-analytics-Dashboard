import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    BarChart, Bar, Legend, PieChart, Pie, Cell
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-lg">
                <p className="text-slate-500 text-sm">{label}</p>
                <p className="text-slate-900 font-bold text-lg">
                    {payload[0].value.toLocaleString()}
                </p>
            </div>
        );
    }
    return null;
};

const Analysis = () => {
    const [data, setData] = useState({ monthly: [], region: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/api/sales/analysis', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="text-slate-500">Loading...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-slate-900">Sales Analysis</h2>
                <p className="text-slate-500 mt-1">Deep dive into your sales trends</p>
            </div>

            {/* Monthly Trend */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6">
                <h3 className="text-xl font-bold mb-6 text-slate-900">Monthly Revenue Trend</h3>
                <div className="h-80 w-full">
                    {data?.monthly?.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.monthly}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                <RechartsTooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-400">
                            No monthly data available. Please upload sales data.
                        </div>
                    )}
                </div>
            </div>

            {/* Regional Performance */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6">
                <h3 className="text-xl font-bold mb-6 text-slate-900">Sales by Region</h3>
                <div className="h-80 w-full">
                    {data?.region?.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.region}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                <RechartsTooltip content={<CustomTooltip />} />
                                <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-400">
                            No regional data available.
                        </div>
                    )}
                </div>
            </div>

            {/* Category Performance */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6">
                <h3 className="text-xl font-bold mb-6 text-slate-900">Sales by Category</h3>
                <div className="h-80 w-full">
                    {data?.category?.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.category}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {data.category.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip content={<CustomTooltip />} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-400">
                            No category data available.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Analysis;
