import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Upload from './pages/Upload';
import Analysis from './pages/Analysis';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layout/MainLayout';
import ErrorBoundary from './components/ErrorBoundary';
import LandingPage from './pages/LandingPage';

function App() {
    return (
        <ErrorBoundary>
            <Router>
                <AuthProvider>
                    <div className="min-h-screen bg-dark-900 text-white font-sans">
                        <Routes>
                            <Route path="/" element={<LandingPage />} />

                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            <Route path="/reset-password/:resetToken" element={<ResetPassword />} />

                            {/* Protected Routes wrapped in MainLayout */}
                            <Route path="/dashboard" element={
                                <ProtectedRoute>
                                    <MainLayout>
                                        <Dashboard />
                                    </MainLayout>
                                </ProtectedRoute>
                            } />
                            <Route path="/upload" element={
                                <ProtectedRoute roles={['admin']}>
                                    <MainLayout>
                                        <Upload />
                                    </MainLayout>
                                </ProtectedRoute>
                            } />
                            <Route path="/analysis" element={
                                <ProtectedRoute>
                                    <MainLayout>
                                        <Analysis />
                                    </MainLayout>
                                </ProtectedRoute>
                            } />
                            <Route path="/reports" element={
                                <ProtectedRoute>
                                    <MainLayout>
                                        <Reports />
                                    </MainLayout>
                                </ProtectedRoute>
                            } />
                            <Route path="/profile" element={
                                <ProtectedRoute>
                                    <MainLayout>
                                        <Profile />
                                    </MainLayout>
                                </ProtectedRoute>
                            } />

                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </div>
                </AuthProvider>
            </Router>
        </ErrorBoundary>
    );
}

export default App;
