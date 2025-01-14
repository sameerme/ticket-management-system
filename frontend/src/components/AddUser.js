import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
    Box,
    TextField as MuiTextField,
    Button,
    MenuItem,
    CircularProgress,
    Typography,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

// Role mapping
const ROLE_MAPPING = {
    admin: 'Admin',
    content_producer: 'Producer',
    video_editor: 'Video Editor',
    graphic_designer: 'Graphic Designer',
};

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
        .matches(/^(?=.*[a-zA-Z])(?=.*[!@#$%^&*]).*$/, 'Must contain one special character')
        .required('Password is required'),
    role: Yup.string()
        .oneOf(Object.keys(ROLE_MAPPING), 'Invalid role')
        .required('Role is required'),
});

const AddUser = () => {
    const navigate = useNavigate();
    const { user } = useAuth(); // Fetch user data from AuthContext

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const response = await fetch('http://localhost:4000/auth/adduser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`, // Include Authorization header
                },
                body: JSON.stringify(values),
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                resetForm();
                navigate('/profile'); // Redirect to profile after successful submission
            } else {
                alert(data.error || 'Error adding user');
            }
        } catch (error) {
            console.error('Error during user addition:', error);
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
                Add User
            </Typography>
            <Formik
                initialValues={{
                    name: '',
                    email: '',
                    mobileNumber: '',
                    username: '',
                    password: '',
                    role: '',
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, errors, touched }) => (
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
                                    label="Password"
                                    type="password"
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    error={touched.password && Boolean(errors.password)}
                                    helperText={touched.password && errors.password}
                                />
                            )}
                        </Field>

                        <Field name="role">
                            {({ field }) => (
                                <MuiTextField
                                    {...field}
                                    label="Role"
                                    select
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    error={touched.role && Boolean(errors.role)}
                                    helperText={touched.role && errors.role}
                                >
                                    {Object.entries(ROLE_MAPPING).map(([value, label]) => (
                                        <MenuItem key={value} value={value}>
                                            {label}
                                        </MenuItem>
                                    ))}
                                </MuiTextField>
                            )}
                        </Field>

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <CircularProgress size={24} /> : 'Add User'}
                        </Button>
                    </Form>
                )}
            </Formik>
        </Box>
    );
};

export default AddUser;
