import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Box, Typography, CircularProgress, Alert, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Profile = () => {
    const { user , logout } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Get navigate function    

    useEffect(() => {
        if (!user || !user.token) {
            setError('User not logged in.');
            setLoading(false);
            return;
        }

        const fetchProfileData = async () => {
            try {
                console.log('Sending Authorization Header:', `Bearer ${user.token}`);

                const response = await fetch('http://localhost:4000/auth/profile', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${user.token}`, // Send token in header
                    },
                });

                if (!response.ok) {
                    const errorText = await response.text(); // Read response as text
                    console.error('Error Response:', errorText);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Profile data fetched:', data);

                setProfileData(data);
            } catch (err) {
                console.error('Error fetching profile data:', err);
                setError('An error occurred while fetching user data');
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/signin'); // Redirect to signin page
    }

    if (loading) {
        return (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                maxWidth: 600,
                mx: 'auto',
                mt: 4,
                p: 3,
                border: '1px solid #ddd',
                borderRadius: 2,
                boxShadow: 3,
                backgroundColor: '#fff',
            }}
        >
            <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
                Welcome, {profileData.username}!
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Name:</strong> {profileData.name}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Email:</strong> {profileData.email}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Mobile Number:</strong> {profileData.mobile_number}
            </Typography>
            
            <Button
                variant="contained"
                color="secondary"
                fullWidth
                sx={{ mt: 3 }}
                onClick={logout}
            >
                Sign Out 

            </Button>

        </Box>
    );
};

export default Profile;
