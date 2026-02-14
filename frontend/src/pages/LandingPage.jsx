import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart, TrendingUp, PieChart, ArrowRight, ShieldCheck, Zap, Users, CheckCircle2, Layout, Database, Terminal, User } from 'lucide-react';

const LandingPage = () => {
    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        setMousePosition({
            x: e.clientX,
            y: e.clientY
        });
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const stagger = {
        visible: { transition: { staggerChildren: 0.1 } }
    };

    return (
        <div
            onMouseMove={handleMouseMove}
            className="min-h-screen bg-aurora font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900 relative overflow-hidden"
        >
            {/* Interactive Mouse Spotlight with stronger glow for Aurora */}
            <div
                className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
                style={{
                    background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.4), transparent 40%)`
                }}
            />

            {/* Global Gradient Spotlights (Breathing) */}
            <div className="fixed top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-blue-50/80 to-transparent pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '4s' }}></div>
            {/* Navbar */}
            <nav className="fixed top-0 w-full bg-white/70 backdrop-blur-xl border-b border-white/50 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
                            <BarChart className="text-white" size={18} />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900">SalesFlow</span>
                    </div>

                    {/* Nav Links - Desktop */}
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Features</a>
                        <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">How it Works</a>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex items-center gap-4">
                        <Link
                            to="/login"
                            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors border border-transparent hover:border-slate-200 px-4 py-2 rounded-lg"
                        >
                            Log in
                        </Link>
                        <Link
                            to="/register"
                            className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center z-0">
                {/* Subtle Glow behind text */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-3xl -z-10 opacity-60"></div>


                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={stagger}
                    className="relative z-10"
                >
                    <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
                        Drive Growth with <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-600 to-blue-600 animate-text-shimmer">
                            Data-Driven Precision
                        </span>
                    </motion.h1>

                    <motion.p variants={fadeInUp} className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Enterprise-grade analytics for teams that demand clarity without the noise.
                        Transform raw data into actionable strategies instantly.
                    </motion.p>

                    <motion.div variants={fadeInUp} className="flex items-center justify-center gap-4">
                        <Link
                            to="/register"
                            className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl text-lg hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5"
                        >
                            Get Started Now
                        </Link>
                        <Link
                            to="/login"
                            className="px-8 py-4 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl text-lg hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-2"
                        >
                            <User size={20} />
                            Log in
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            {/* Bento Grid Features */}
            <div id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Powerful Features, Simplified</h2>
                    <p className="text-slate-500 max-w-xl mx-auto">
                        Everything you need to analyze, track, and scale your sales operations in one unified dashboard.
                    </p>
                </div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={stagger}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {/* Large Card: Real-time Growth */}
                    <motion.div variants={fadeInUp} className="md:col-span-2 glass-card p-8 hover:border-blue-200 transition-colors">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                            <TrendingUp className="text-blue-600" size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Real-time Growth Tracking</h3>
                        <p className="text-slate-500 text-sm mb-8 max-w-md">
                            Visualize complex revenue streams with intuitive, real-time charts. Spot trends before they become history.
                        </p>
                        {/* Abstract Chart Visualization */}
                        <div className="flex items-end gap-2 h-32 mt-4 px-4 border-b border-slate-200/50">
                            <div className="w-full bg-blue-100 h-[30%] rounded-t-sm"></div>
                            <div className="w-full bg-blue-200 h-[50%] rounded-t-sm"></div>
                            <div className="w-full bg-blue-300 h-[40%] rounded-t-sm"></div>
                            <div className="w-full bg-blue-400 h-[70%] rounded-t-sm"></div>
                            <div className="w-full bg-blue-500 h-[55%] rounded-t-sm"></div>
                            <div className="w-full bg-blue-600 h-[85%] rounded-t-sm shadow-lg shadow-blue-500/20"></div>
                        </div>
                    </motion.div>

                    {/* Standard Card: Role Based Access */}
                    <motion.div variants={fadeInUp} className="glass-card p-8 hover:shadow-xl transition-shadow">
                        <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center mb-6">
                            <ShieldCheck className="text-violet-600" size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Role-Based Access</h3>
                        <p className="text-slate-500 text-sm">
                            Granular permission controls for enterprise teams. Secure your data down to the field level.
                        </p>
                    </motion.div>

                    {/* Standard Card: Fast Processing */}
                    <motion.div variants={fadeInUp} className="glass-card p-8 hover:shadow-xl transition-shadow">
                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center mb-6">
                            <Zap className="text-amber-600" size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Fast Data Processing</h3>
                        <p className="text-slate-500 text-sm">
                            Built on a high-velocity engine that processes millions of rows in milliseconds.
                        </p>
                    </motion.div>

                    {/* Standard Card: Export & Share */}
                    <motion.div variants={fadeInUp} className="glass-card p-8 hover:shadow-xl transition-shadow">
                        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                            <ArrowRight className="text-emerald-600 -rotate-45" size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Export & Share</h3>
                        <p className="text-slate-500 text-sm">
                            Seamlessly export to CSV, PDF, or sync directly to your favorite data warehouses.
                        </p>
                    </motion.div>

                    {/* Standard Card: Customizable Reports */}
                    <motion.div variants={fadeInUp} className="glass-card p-8 hover:shadow-xl transition-shadow">
                        <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center mb-6">
                            <Layout className="text-pink-600" size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Customizable Reports</h3>
                        <p className="text-slate-500 text-sm mb-4">
                            Drag and drop builder to create the perfect dashboard for your KPIs.
                        </p>
                        <a href="#" className="text-blue-600 text-sm font-semibold hover:underline flex items-center gap-1">
                            See all features <ArrowRight size={14} />
                        </a>
                    </motion.div>
                </motion.div>
            </div>

            {/* Streamlined Intelligence Section */}
            <div id="how-it-works" className="py-24 bg-slate-50/50 border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-16">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">Streamlined Intelligence</h2>
                            <p className="text-slate-500 max-w-md">From raw data to revenue decisions in three simple steps.</p>
                        </div>
                        <a href="#" className="hidden md:flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700">
                            View Documentation <ArrowRight size={16} />
                        </a>
                    </div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={stagger}
                        className="grid grid-cols-1 md:grid-cols-3 gap-12 relative"
                    >
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-0.5 bg-slate-200 -z-10"></div>

                        {/* Step 1 */}
                        <motion.div variants={fadeInUp} className="relative">
                            <div className="w-16 h-16 bg-white border border-slate-200 rounded-full flex items-center justify-center text-xl font-bold text-slate-900 shadow-sm mb-6 z-10">
                                01
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-3">Upload & Sync</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Connect your CRM, upload CSVs, or use our API. We sanitize and structure your data automatically.
                            </p>
                        </motion.div>

                        {/* Step 2 */}
                        <motion.div variants={fadeInUp} className="relative">
                            <div className="w-16 h-16 bg-white border border-blue-200 rounded-full flex items-center justify-center text-xl font-bold text-blue-600 shadow-sm shadow-blue-500/10 mb-6 z-10">
                                02
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-3">Analyze Instantly</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Our engine identifies patterns, churn risks, and upsell opportunities in seconds, not days.
                            </p>
                        </motion.div>

                        {/* Step 3 */}
                        <motion.div variants={fadeInUp} className="relative">
                            <div className="w-16 h-16 bg-white border border-slate-200 rounded-full flex items-center justify-center text-xl font-bold text-slate-900 shadow-sm mb-6 z-10">
                                03
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-3">Decide & Act</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Deploy strategies based on facts. Export reports to stakeholders or trigger automated workflows.
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Built for Every Role */}
            <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-slate-900">Built for Every Role</h2>
                </div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={stagger}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {/* Role Card 1 */}
                    <motion.div variants={fadeInUp} className="glass-card p-8">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mb-6 shadow-lg shadow-blue-600/20">
                            <BarChart className="text-white" size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Sales Managers</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2 text-sm text-slate-600">
                                <CheckCircle2 size={16} className="text-emerald-500 mt-0.5" />
                                Monitor team performance metrics
                            </li>
                            <li className="flex items-start gap-2 text-sm text-slate-600">
                                <CheckCircle2 size={16} className="text-emerald-500 mt-0.5" />
                                Forecast revenue with 99% accuracy
                            </li>
                        </ul>
                    </motion.div>

                    {/* Role Card 2 */}
                    <motion.div variants={fadeInUp} className="glass-card p-8">
                        <div className="w-10 h-10 bg-violet-600 rounded-lg flex items-center justify-center mb-6 shadow-lg shadow-violet-600/20">
                            <Terminal className="text-white" size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Data Analysts</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2 text-sm text-slate-600">
                                <CheckCircle2 size={16} className="text-emerald-500 mt-0.5" />
                                Deep dive into raw datasets
                            </li>
                            <li className="flex items-start gap-2 text-sm text-slate-600">
                                <CheckCircle2 size={16} className="text-emerald-500 mt-0.5" />
                                Build complex custom SQL queries
                            </li>
                        </ul>
                    </motion.div>

                    {/* Role Card 3 */}
                    <motion.div variants={fadeInUp} className="glass-card p-8">
                        <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center mb-6 shadow-lg shadow-emerald-600/20">
                            <Database className="text-white" size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-4">SMB Owners</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2 text-sm text-slate-600">
                                <CheckCircle2 size={16} className="text-emerald-500 mt-0.5" />
                                No-code setup in minutes
                            </li>

                        </ul>
                    </motion.div>
                </motion.div>
            </div>

            {/* CTA Banner */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="bg-blue-600 rounded-3xl p-12 md:p-20 text-center text-white relative overflow-hidden"
                >
                    <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                            Ready to optimize your sales funnel?
                        </h2>
                        <p className="text-blue-100 text-lg">
                            Join 5,000+ forward-thinking teams using SalesFlow to drive precision revenue growth.
                        </p>
                        <div className="flex items-center justify-center gap-4 pt-4">
                            <Link
                                to="/register"
                                className="px-8 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors"
                            >
                                Get Started Now
                            </Link>
                            <button className="px-8 py-3 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 transition-colors border border-blue-500">
                                Contact Sales
                            </button>
                        </div>
                    </div>
                    {/* Background decorations */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-x-1/2 translate-y-1/2"></div>
                </motion.div>
            </div>

            {/* Footer */}
            <footer className="bg-white/50 backdrop-blur-lg py-16 border-t border-slate-100">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={stagger}
                    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-3 gap-8"
                >
                    <motion.div variants={fadeInUp} className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
                                <BarChart className="text-white" size={14} />
                            </div>
                            <span className="font-bold text-slate-900">SalesFlow</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                            The premium standard for modern sales analytics. Precision, speed, and clarity for teams that refuse to compromise.
                        </p>
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                        <h4 className="font-bold text-slate-900 text-sm mb-4">PRODUCT</h4>
                        <ul className="space-y-2 text-xs text-slate-500">
                            <li><a href="#" className="hover:text-blue-600">Features</a></li>
                            <li><a href="#" className="hover:text-blue-600">Integrations</a></li>

                            <li><a href="#" className="hover:text-blue-600">Changelog</a></li>
                        </ul>
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                        <h4 className="font-bold text-slate-900 text-sm mb-4">COMPANY</h4>
                        <ul className="space-y-2 text-xs text-slate-500">
                            <li><a href="#" className="hover:text-blue-600">About Us</a></li>
                            <li><a href="#" className="hover:text-blue-600">Careers</a></li>
                            <li><a href="#" className="hover:text-blue-600">Blog</a></li>
                            <li><a href="#" className="hover:text-blue-600">Contact</a></li>
                        </ul>
                    </motion.div>


                </motion.div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] text-slate-400">© 2026 SalesFlow Inc. All rights reserved.</p>
                    <div className="flex gap-4 text-[10px] text-slate-400">
                        <a href="#" className="hover:text-slate-600">Privacy Policy</a>
                        <a href="#" className="hover:text-slate-600">Terms of Service</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
