import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Box, TextField as MuiTextField, Button, MenuItem, Typography, CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext';

// Validation Schema
const validationSchema = Yup.object({
    topicTeam: Yup.string().required('Topic team is required'),
    priority: Yup.string().required('Priority is required'),
    topicDescription: Yup.string().required('Topic description is required'),
    videoAssetLocations: Yup.string().required('Asset locations are required'),
    templateType: Yup.string().required('Template type is required'),
});

const CreateTicket = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const response = await fetch('http://localhost:4000/auth/create-ticket', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify(values),
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                resetForm();
                navigate('/dashboard'); // Redirect after submission
            } else {
                alert(data.error || 'Error creating ticket');
            }
        } catch (error) {
            console.error('Error creating ticket:', error);
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
                Create Ticket
            </Typography>
            <Formik
                initialValues={{
                    topicTeam: '',
                    priority: '',
                    topicDescription: '',
                    videoAssetLocations: '',
                    templateType: '',
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, errors, touched }) => (
                    <Form>
                        <Field name="topicTeam">
                            {({ field }) => (
                                <MuiTextField
                                    {...field}
                                    label="Topic Team"
                                    select
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    error={touched.topicTeam && Boolean(errors.topicTeam)}
                                    helperText={touched.topicTeam && errors.topicTeam}
                                >
                                    {['OTV Khabar', 'OTV English', 'Odisha Reporter', 'TV'].map((team) => (
                                        <MenuItem key={team} value={team}>
                                            {team}
                                        </MenuItem>
                                    ))}
                                </MuiTextField>
                            )}
                        </Field>

                        <Field name="priority">
                            {({ field }) => (
                                <MuiTextField
                                    {...field}
                                    label="Priority"
                                    select
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    error={touched.priority && Boolean(errors.priority)}
                                    helperText={touched.priority && errors.priority}
                                >
                                    {['Breaking', 'High', 'Medium', 'Low'].map((level) => (
                                        <MenuItem key={level} value={level}>
                                            {level}
                                        </MenuItem>
                                    ))}
                                </MuiTextField>
                            )}
                        </Field>

                        <Field name="topicDescription">
                            {({ field }) => (
                                <MuiTextField
                                    {...field}
                                    label="Topic Description"
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    error={touched.topicDescription && Boolean(errors.topicDescription)}
                                    helperText={touched.topicDescription && errors.topicDescription}
                                />
                            )}
                        </Field>

                        <Field name="videoAssetLocations">
                            {({ field }) => (
                                <MuiTextField
                                    {...field}
                                    label="Asset Locations"
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    error={touched.videoAssetLocations && Boolean(errors.videoAssetLocations)}
                                    helperText={touched.videoAssetLocations && errors.videoAssetLocations}
                                />
                            )}
                        </Field>

                        <Field name="templateType">
                            {({ field }) => (
                                <MuiTextField
                                    {...field}
                                    label="Template Type"
                                    select
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    error={touched.templateType && Boolean(errors.templateType)}
                                    helperText={touched.templateType && errors.templateType}
                                >
                                    {['Special package', 'Long Video', 'Short Video', 'Current Affair content', 'Short reel'].map((type) => (
                                        <MenuItem key={type} value={type}>
                                            {type}
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
                            {isSubmitting ? <CircularProgress size={24} /> : 'Create Ticket'}
                        </Button>
                    </Form>
                )}
            </Formik>
        </Box>
    );
};

export default CreateTicket;
