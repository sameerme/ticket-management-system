import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
    Box,
    TextField as MuiTextField,
    Button,
    Typography,
    CircularProgress,
    IconButton,
    InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

// Validation schema using Yup
const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
});

const Signin = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((prev) => !prev);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {

            // Send a POST request to the server
            console.log('Sending:', values);

            const response = await fetch('http://localhost:4000/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });


            console.log('Raw Response:', response);

            const data = await response.json();
            console.log('API response:', data);

            if (response.ok) {
                console.log('Login successful:', data);
                await login(data); // Save user data in context
                console.log('User logged in:', data);
                navigate('/profile'); // Redirect to profile page
            } else {
                alert(data.error || 'Login failed');
            }
        } catch (error) {
            console.error('Error during login:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box
            sx={{
                maxWidth: 400,
                mx: 'auto',
                mt: 8,
                p: 3,
                border: '1px solid #ddd',
                borderRadius: 2,
                boxShadow: 3,
                backgroundColor: '#fff',
            }}
        >
            <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
                Sign In
            </Typography>
            <Formik
                initialValues={{
                    username: '',
                    password: '',
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, errors, touched }) => (
                    <Form>
                        <Field name="username">
                            {({ field }) => (
                                <MuiTextField
                                    {...field}
                                    label="Username"
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    error={touched.username && Boolean(errors.username)}
                                    helperText={touched.username && errors.username}
                                />
                            )}
                        </Field>

                        <Field name="password">
                            {({ field }) => (
                                <MuiTextField
                                    {...field}
                                    type={showPassword ? 'text' : 'password'}
                                    label="Password"
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    error={touched.password && Boolean(errors.password)}
                                    helperText={touched.password && errors.password}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={handleClickShowPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? (
                                                        <Visibility />
                                                    ) : (
                                                        <VisibilityOff />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            )}
                        </Field>

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <CircularProgress size={24} /> : 'Sign In'}
                        </Button>
                    </Form>
                )}
            </Formik>
            <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                Don't have an account?{' '}
                <Link to="/signup" style={{ textDecoration: 'none', color: 'blue' }}>
                    Sign Up
                </Link>
            </Typography>
        </Box>
    );
};

export default Signin;
