import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signin from './components/Signin';
import Signup from './components/Signup';
import Profile from './components/Profile';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import HeaderH1 from './components/HeaderH1';
import AddUser from './components/AddUser';
import AuthenticatedLayout from './components/AuthenticatedLayout';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    {/* Redirect "/" to "/signin" */}
                    <Route path="/" element={<Navigate to="/signin" />} />
                    {/* Explicit route for "/signin" */}
                    <Route path="/signin" element={<Signin />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* Protected Routes */}
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <>
                                    <AuthenticatedLayout>
                                        <Profile />
                                    </AuthenticatedLayout>
                                </>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/adduser"
                        element={
                            <ProtectedRoute>
                                <AuthenticatedLayout>
                                    <AddUser />
                                </AuthenticatedLayout>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
