import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Signin from './components/Signin';
import Signup from './components/Signup';
import Profile from './components/Profile';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AuthenticatedLayout from './components/AuthenticatedLayout';
import AddUser from './components/AddUser';
import Dashboard from './components/Dashboard';
import CreateTicket from './components/CreateTicket';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Navigate to="/signin" />} />
                    <Route path="/signin" element={<Signin />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* Protected Routes with AuthenticatedLayout */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <AuthenticatedLayout>
                                    <Outlet />
                                </AuthenticatedLayout>
                            </ProtectedRoute>
                        }
                    >
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/create-ticket" element={<CreateTicket />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/adduser" element={<AddUser />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
