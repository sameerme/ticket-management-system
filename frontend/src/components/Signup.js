import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { Link } from 'react-router-dom';
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
import { useNavigate } from 'react-router-dom';

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    mobileNumber: Yup.string()
        .matches(/^[0-9]+$/, 'Must be only digits')
        .min(10, 'Must be exactly 10 digits')
        .max(10, 'Must be exactly 10 digits')
        .required('Mobile number is required'),
    username: Yup.string().required('Username is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters long')
        .required('Password is required'),
});

const Signup = () => {

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((prev) => !prev);
    const navigate = useNavigate(); // For navigation to Sign In page

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const response = await fetch('http://localhost:4000/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                resetForm();
                navigate('/signin'); // Redirect to Sign In page
            } else {
                alert(data.error || 'Error signing up');
            }
        } catch (error) {
            console.error('Error during sign-up:', error);
        } finally {
            setSubmitting(false);
        }
    };

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
                Sign Up
            </Typography>
            <Formik
                initialValues={{
                    name: '',
                    email: '',
                    mobileNumber: '',
                    username: '',
                    password: '',
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, errors, touched, handleChange, handleBlur, values }) => (
                    <Form>
                        <Field name="name">
                            {({ field }) => (
                                <MuiTextField
                                    {...field}
                                    label="Name"
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    error={touched.name && Boolean(errors.name)}
                                    helperText={touched.name && errors.name}
                                />
                            )}
                        </Field>

                        <Field name="email">
                            {({ field }) => (
                                <MuiTextField
                                    {...field}
                                    label="Email"
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    error={touched.email && Boolean(errors.email)}
                                    helperText={touched.email && errors.email}
                                />
                            )}
                        </Field>

                        <Field name="mobileNumber">
                            {({ field }) => (
                                <MuiTextField
                                    {...field}
                                    label="Mobile Number"
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    error={touched.mobileNumber && Boolean(errors.mobileNumber)}
                                    helperText={touched.mobileNumber && errors.mobileNumber}
                                />
                            )}
                        </Field>

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
                                                <IconButton onClick={handleClickShowPassword} edge="end">
                                                    {showPassword ? <Visibility /> : <VisibilityOff />}
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
                            {isSubmitting ? <CircularProgress size={24} /> : 'Sign Up'}
                        </Button>
                    </Form>
                )}
            </Formik>
        </Box>
    );
};

export default Signup;
