import React from 'react';
import HeaderH1 from './HeaderH1';
import { useAuth } from '../context/AuthContext';

const AuthenticatedLayout = ({ children }) => {
    const { user, logout } = useAuth();

    return (
        <>
            <HeaderH1 role={user?.role || 'User'} onLogout={logout} />
            <main style={{ margin: '20px' }}>{children}</main>
        </>
    );
};

export default AuthenticatedLayout;
