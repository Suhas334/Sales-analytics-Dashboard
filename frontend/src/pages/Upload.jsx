import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import { Upload as UploadIcon, CheckCircle, AlertCircle, FileText, ArrowRight, Trash2, Calendar } from 'lucide-react';

const REQUIRED_FIELDS = [
    { key: 'date', label: 'Date (DD-MM-YYYY or YYYY-MM-DD)' },
    { key: 'product', label: 'Product Name' },
    { key: 'category', label: 'Category' },
    { key: 'region', label: 'Region' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'price', label: 'Price' }
];

const UploadPage = () => {
    const [file, setFile] = useState(null);
    const [headers, setHeaders] = useState([]);
    const [mapping, setMapping] = useState({});
    const [step, setStep] = useState(1); // 1: Select File, 2: Map Columns
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: string }
    const [history, setHistory] = useState([]);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await axios.get('/api/sales/uploads');
            setHistory(res.data);
        } catch (err) {
            console.error('Failed to fetch history', err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this upload and all its records?')) return;
        try {
            await axios.delete(`/api/sales/uploads/${id}`);
            setStatus({ type: 'success', message: 'Upload batch deleted.' });
            fetchHistory();
        } catch (err) {
            console.error(err);
            setStatus({ type: 'error', message: 'Failed to delete upload.' });
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setStatus(null);

            // Parse headers
            Papa.parse(selectedFile, {
                header: true,
                preview: 1, // Read only first few lines to get headers
                complete: (results) => {
                    if (results.meta.fields) {
                        setHeaders(results.meta.fields);
                        // Auto-map if headers match roughly
                        const initialMapping = {};
                        REQUIRED_FIELDS.forEach(field => {
                            const match = results.meta.fields.find(h =>
                                h.toLowerCase().includes(field.key) ||
                                h.toLowerCase() === field.key
                            );
                            if (match) initialMapping[field.key] = match;
                        });
                        setMapping(initialMapping);
                        setStep(2);
                    }
                },
                error: (err) => {
                    console.error(err);
                    setStatus({ type: 'error', message: 'Failed to read CSV headers.' });
                }
            });
        }
    };

    const handleMappingChange = (fieldKey, header) => {
        setMapping(prev => ({ ...prev, [fieldKey]: header }));
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        // Validate mapping
        const missingFields = REQUIRED_FIELDS.filter(f => !mapping[f.key]);
        if (missingFields.length > 0) {
            setStatus({ type: 'error', message: `Please map all fields. Missing: ${missingFields.map(f => f.label).join(', ')}` });
            return;
        }

        setUploading(true);
        setStatus(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('mapping', JSON.stringify(mapping));

        try {
            const res = await axios.post('/api/sales/upload', formData, {
                // Do NOT set Content-Type manually for FormData, let browser set it with boundary
            });
            setStatus({ type: 'success', message: `${res.data.count} records uploaded successfully!` });
            setFile(null);
            setStep(1);
            setMapping({});
            fetchHistory();
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || err.message || 'Upload failed. Please check your data.';
            setStatus({ type: 'error', message: msg });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-slate-900">Upload Sales Data</h2>
                <p className="text-slate-500 mt-1">Import any CSV dataset by mapping columns</p>
            </div>

            <div className="glass-card p-8">
                {step === 1 && (
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center hover:border-blue-400 transition-colors bg-slate-50">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <UploadIcon size={40} className="text-primary" />
                        </div>

                        <h3 className="text-2xl font-bold mb-4 text-slate-900">Choose your CSV File</h3>
                        <p className="text-slate-500 mb-8 max-w-md mx-auto">
                            Upload your sales data. We'll help you map your columns to our system in the next step.
                        </p>

                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="hidden"
                            id="file-upload"
                        />
                        <label
                            htmlFor="file-upload"
                            className="inline-block px-8 py-4 bg-primary hover:bg-blue-600 cursor-pointer rounded-xl font-bold text-white shadow-lg shadow-blue-500/20 transition-all transform hover:-translate-y-1"
                        >
                            Select CSV File
                        </label>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-200">
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                                <FileText size={24} className="text-blue-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">{file?.name}</h3>
                                <p className="text-sm text-slate-500">Map your file headers to the required fields</p>
                            </div>
                            <button
                                onClick={() => { setStep(1); setFile(null); }}
                                className="ml-auto text-sm text-slate-500 hover:text-slate-900"
                            >
                                Cancel
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {REQUIRED_FIELDS.map((field) => (
                                <div key={field.key} className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        {field.label} <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <ArrowRight size={16} className="text-slate-400" />
                                        <select
                                            value={mapping[field.key] || ''}
                                            onChange={(e) => handleMappingChange(field.key, e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                        >
                                            <option value="">Select Column...</option>
                                            {headers.map(h => (
                                                <option key={h} value={h}>{h}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleUpload}
                            disabled={uploading}
                            className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                        >
                            {uploading ? 'Processing...' : (
                                <>
                                    <CheckCircle size={20} />
                                    Confirm & Upload
                                </>
                            )}
                        </button>
                    </div>
                )}

                {status && (
                    <div className={`mt-6 p-4 rounded-xl flex items-start gap-3 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'
                        }`}>
                        {status.type === 'success' ? <CheckCircle className="shrink-0" /> : <AlertCircle className="shrink-0" />}
                        <div>
                            <p className="font-bold">{status.type === 'success' ? 'Success!' : 'Error'}</p>
                            <p className="text-sm opacity-90">{status.message}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Upload History */}
            <div className="glass-card p-6">
                <h3 className="text-xl font-bold mb-4 text-slate-900">Upload History</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 text-slate-500 text-sm">
                                <th className="py-3 px-4 font-semibold">Filename</th>
                                <th className="py-3 px-4 font-semibold">Date Uploaded</th>
                                <th className="py-3 px-4 font-semibold">Records</th>
                                <th className="py-3 px-4 text-right font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {history.length > 0 ? (
                                history.map((item) => (
                                    <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="py-3 px-4 flex items-center gap-2 text-slate-700 font-medium">
                                            <FileText size={16} className="text-blue-500" />
                                            {item.filename}
                                        </td>
                                        <td className="py-3 px-4 text-slate-500">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} />
                                                {new Date(item.uploaded_at).toLocaleDateString()} {new Date(item.uploaded_at).toLocaleTimeString()}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-slate-600">{item.record_count}</td>
                                        <td className="py-3 px-4 text-right">
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                                                title="Delete this upload"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="py-8 text-center text-slate-400">
                                        No uploads found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="glass-card p-6 border border-red-200 bg-red-50/30">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-red-600">Danger Zone</h3>
                        <p className="text-red-500 text-sm mt-1">Clear all sales data from the database. This action cannot be undone.</p>
                    </div>
                    <button
                        onClick={async () => {
                            if (window.confirm('Are you sure you want to delete ALL sales data? This cannot be undone.')) {
                                try {
                                    await axios.delete('/api/sales/clear');
                                    setStatus({ type: 'success', message: 'Database cleared successfully.' });
                                    fetchHistory();
                                } catch (err) {
                                    setStatus({ type: 'error', message: 'Failed to clear database.' });
                                }
                            }
                        }}
                        className="px-6 py-3 bg-red-100/50 hover:bg-red-100 text-red-600 rounded-lg font-bold border border-red-200 transition-all flex items-center gap-2"
                    >
                        Clear All Data
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadPage;
