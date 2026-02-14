import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, Filter, Search, ChevronLeft, ChevronRight, FileX } from 'lucide-react';

const Reports = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        region: 'All',
        product: '',
        category: 'All'
    });
    const [filterOptions, setFilterOptions] = useState({ regions: [], categories: [] });

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchSales = async () => {
        setLoading(true);
        setCurrentPage(1); // Reset to first page on new fetch
        try {
            const token = localStorage.getItem('token');
            const params = { ...filters };
            Object.keys(params).forEach(key => {
                if (params[key] === 'All' || params[key] === '') delete params[key];
            });

            const res = await axios.get('/api/sales', {
                params,
                headers: { Authorization: `Bearer ${token}` }
            });
            setSales(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            fetchSales();
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/api/sales/filters', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFilterOptions(res.data);
            } catch (err) {
                console.error('Failed to fetch filters', err);
            }
        };
        fetchData();
    }, []);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleExport = async () => {
        if (!sales.length) return;

        // Track download
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/sales/download', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (err) {
            console.error("Failed to track download", err);
        }

        const headers = ['Date', 'Product', 'Category', 'Region', 'Quantity', 'Price', 'Total'];
        const csvContent = [
            headers.join(','),
            ...sales.map(row => [
                new Date(row.date).toLocaleDateString(),
                row.product,
                row.category,
                row.region,
                row.quantity,
                row.price,
                row.quantity * row.price
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sales_report.csv';
        a.click();
    };

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sales.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sales.length / itemsPerPage);

    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">Reports & Filters</h2>
                    <p className="text-slate-500 mt-1">Generate custom reports from your data</p>
                </div>
                <button
                    onClick={handleExport}
                    disabled={!sales.length}
                    className="flex items-center gap-2 px-4 py-2 bg-secondary/80 hover:bg-secondary text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Download size={18} />
                    Export CSV
                </button>
            </div>

            {/* Filters Bar */}
            <div className="bg-white border border-slate-200 shadow-sm p-4 rounded-xl flex flex-wrap gap-4 items-end">
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Start Date</label>
                    <input
                        type="date"
                        name="startDate"
                        value={filters.startDate}
                        onChange={handleFilterChange}
                        className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 block shadow-sm"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">End Date</label>
                    <input
                        type="date"
                        name="endDate"
                        value={filters.endDate}
                        onChange={handleFilterChange}
                        className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 block shadow-sm"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Region</label>
                    <select
                        name="region"
                        value={filters.region}
                        onChange={handleFilterChange}
                        className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 block min-w-[150px] shadow-sm"
                    >
                        <option value="All" className="text-slate-900">All Regions</option>
                        {filterOptions.regions.map(region => (
                            <option key={region} value={region} className="text-slate-900">{region}</option>
                        ))}
                    </select>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Category</label>
                    <select
                        name="category"
                        value={filters.category}
                        onChange={handleFilterChange}
                        className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 block min-w-[150px] shadow-sm"
                    >
                        <option value="All" className="text-slate-900">All Categories</option>
                        {filterOptions.categories.map(category => (
                            <option key={category} value={category} className="text-slate-900">{category}</option>
                        ))}
                    </select>
                </div>
                <div className="space-y-1 flex-1 min-w-[200px]">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Product Name</label>
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            name="product"
                            placeholder="Search products..."
                            value={filters.product}
                            onChange={handleFilterChange}
                            className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-slate-900 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 shadow-sm"
                        />
                    </div>
                </div>
                <button
                    onClick={fetchSales}
                    className="px-6 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg transition-colors font-bold flex items-center gap-2 shadow-lg shadow-blue-500/30"
                >
                    <Filter size={18} />
                    Apply Filters
                </button>
            </div>

            {/* Results Table */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider bg-slate-50">
                                <th className="p-5 font-semibold">Date</th>
                                <th className="p-5 font-semibold">Product</th>
                                <th className="p-5 font-semibold">Category</th>
                                <th className="p-5 font-semibold">Region</th>
                                <th className="p-5 font-semibold">Qty</th>
                                <th className="p-5 font-semibold">Price</th>
                                <th className="p-5 font-semibold text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="p-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-500">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3"></div>
                                            <p>Loading sales data...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : currentItems.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="p-16 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                                <FileX size={32} className="text-slate-300" />
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900">No records found</h3>
                                            <p className="max-w-xs mx-auto mt-1">
                                                No sales data matches your current filters. Try adjusting your search criteria or date range.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                currentItems.map((sale) => (
                                    <tr key={sale.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="p-5 text-sm text-slate-700 font-medium">
                                            {new Date(sale.date).toLocaleDateString()}
                                        </td>
                                        <td className="p-5 text-sm text-slate-900 font-medium">{sale.product}</td>
                                        <td className="p-5">
                                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                                                {sale.category}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                                <span className="text-sm text-slate-600">{sale.region}</span>
                                            </div>
                                        </td>
                                        <td className="p-5 text-sm text-slate-500">{sale.quantity}</td>
                                        <td className="p-5 text-sm text-slate-500">${sale.price}</td>
                                        <td className="p-5 text-right">
                                            <span className="text-sm font-bold text-emerald-600">
                                                ${(sale.quantity * sale.price).toFixed(2)}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {sales.length > 0 && !loading && (
                    <div className="border-t border-slate-200 p-4 flex items-center justify-between bg-slate-50">
                        <p className="text-sm text-slate-500">
                            Showing <span className="font-medium text-slate-900">{indexOfFirstItem + 1}</span> to{' '}
                            <span className="font-medium text-slate-900">{Math.min(indexOfLastItem, sales.length)}</span> of{' '}
                            <span className="font-medium text-slate-900">{sales.length}</span> results
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={prevPage}
                                disabled={currentPage === 1}
                                className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft size={16} className="text-slate-600" />
                            </button>
                            <div className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700">
                                Page {currentPage} of {totalPages}
                            </div>
                            <button
                                onClick={nextPage}
                                disabled={currentPage === totalPages}
                                className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight size={16} className="text-slate-600" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reports;
