import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, Typography, Button, IconButton, Menu, MenuItem } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';

const HeaderH1 = () => {
    const { user, logout } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    // Handle menu open/close
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // Navigate to Add User (placeholder functionality)
    const handleAddUser = () => {
        console.log('Navigating to Add User...');
        setAnchorEl(null);
        navigate('/adduser'); // Navigate to AddUser page
        //handleMenuClose();
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 2,
                backgroundColor: '#f5f5f5',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            }}
        >
            {/* Logo and Role */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <img
                    src="/Odisha_TV_logo.svg.webp"
                    alt="Logo"
                    style={{ height: '40px', objectFit: 'contain' }}
                />
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {user?.role || 'Role not set'}
                </Typography>
            </Box>

            {/* Icons and Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {/* Notification Icon */}
                <IconButton aria-label="notifications">
                    <NotificationsIcon />
                </IconButton>

                {/* Settings Icon with Menu */}
                <IconButton
                    aria-controls="settings-menu"
                    aria-haspopup="true"
                    onClick={handleMenuOpen}
                >
                    <SettingsIcon />
                </IconButton>
                <Menu
                    id="settings-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    {user?.role === 'admin' && (
                        <MenuItem onClick={handleAddUser}>Add User</MenuItem>
                    )}

                </Menu>

                {/* Sign Out Button */}
                <Button variant="outlined" onClick={logout}>
                    Sign Out
                </Button>
            </Box>
        </Box>
    );
};

export default HeaderH1;
