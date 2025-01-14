import React from 'react';
import { Box } from '@mui/material';
import HeaderH1 from './HeaderH1';
import LeftPanel from './LeftPanel';
import { useAuth } from '../context/AuthContext';

const AuthenticatedLayout = ({ children }) => {
    const { user, logout } = useAuth();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
            }}
        >
            {/* Header at the top */}
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 10,
                    backgroundColor: '#fff', // Ensure header background color
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', // Shadow for better visibility
                }}
            >
                <HeaderH1 role={user?.role || 'User'} onLogout={logout} />
            </Box>

            {/* Main layout with LeftPanel and dynamic content */}
            <Box
                sx={{
                    display: 'flex',
                    flexGrow: 1,
                    marginTop: '64px', // Adjust for header height (example: 64px for a typical header)
                }}
            >
                {/* Left panel */}
                <Box
                    sx={{
                        width: '200px',
                        backgroundColor: '#1976d2', // Blue color for left panel
                        color: '#fff',
                        paddingTop: '20px', // Add padding to account for header
                    }}
                >
                    <LeftPanel />
                </Box>

                {/* Content area */}
                <Box
                    sx={{
                        flexGrow: 1,
                        padding: '20px',
                        backgroundColor: '#f9f9f9',
                        overflowY: 'auto', // Allow scrolling for long content
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default AuthenticatedLayout;
