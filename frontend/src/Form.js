import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
    Box,
    TextField as MuiTextField,
    Button,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';

// Validation Schema
const validationSchema = Yup.object({
    topicTeam: Yup.string().required('Topic Team is required'),
    priority: Yup.string().required('Priority is required'),
    topicDescription: Yup.string()
        .required('Topic Description is required')
        .min(10, 'Description must be at least 10 characters long'),
    videoAssetLocations: Yup.string().required('Video Asset Locations is required'),
    requisitionedBy: Yup.string().required('Requisitioned By is required'),
    templateType: Yup.string().required('Template Type is required'),
});

const FormikMaterialForm = () => {
    const initialValues = {
        topicTeam: '',
        priority: '',
        topicDescription: '',
        videoAssetLocations: '',
        requisitionedBy: '',
        templateType: '',
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        console.log('Form data submitted:', values);
        // Example API call
        try {
            const response = await fetch('http://localhost:4000/submit-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
            const data = await response.json();
            alert(data.message || 'Form submitted successfully!');
            resetForm();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
        setSubmitting(false);
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ errors, touched, isSubmitting, handleChange, handleBlur, values }) => (
                <Form>
                    <Box
                        sx={{
                            maxWidth: 600,
                            mx: 'auto',
                            mt: 4,
                            p: 3,
                            border: '1px solid #ddd',
                            borderRadius: 2,
                            boxShadow: 3,
                        }}
                    >
                        <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
                            Submit Your Details
                        </Typography>

                        {/* Topic Team */}
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Topic Team</InputLabel>
                            <Select
                                name="topicTeam"
                                value={values.topicTeam}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.topicTeam && Boolean(errors.topicTeam)}
                            >
                                <MenuItem value="">Select a team</MenuItem>
                                <MenuItem value="OTV Khabar">OTV Khabar</MenuItem>
                                <MenuItem value="OTV English">OTV English</MenuItem>
                                <MenuItem value="Odisha Reporter">Odisha Reporter</MenuItem>
                                <MenuItem value="TV">TV</MenuItem>
                            </Select>
                            {touched.topicTeam && errors.topicTeam && (
                                <Typography variant="body2" color="error">
                                    {errors.topicTeam}
                                </Typography>
                            )}
                        </FormControl>

                        {/* Priority */}
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Priority</InputLabel>
                            <Select
                                name="priority"
                                value={values.priority}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.priority && Boolean(errors.priority)}
                            >
                                <MenuItem value="">Select priority</MenuItem>
                                <MenuItem value="Breaking">Breaking</MenuItem>
                                <MenuItem value="High">High</MenuItem>
                                <MenuItem value="Medium">Medium</MenuItem>
                                <MenuItem value="Low">Low</MenuItem>
                            </Select>
                            {touched.priority && errors.priority && (
                                <Typography variant="body2" color="error">
                                    {errors.priority}
                                </Typography>
                            )}
                        </FormControl>

                        {/* Topic Description */}
                        <Field name="topicDescription">
                            {({ field, meta }) => (
                                <MuiTextField
                                    {...field}
                                    label="Topic Description"
                                    multiline
                                    rows={4}
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    error={meta.touched && Boolean(meta.error)}
                                    helperText={meta.touched && meta.error}
                                />
                            )}
                        </Field>

                        {/* Video Asset Locations */}
                        <Field name="videoAssetLocations">
                            {({ field, meta }) => (
                                <MuiTextField
                                    {...field}
                                    label="Video Asset Locations"
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    error={meta.touched && Boolean(meta.error)}
                                    helperText={meta.touched && meta.error}
                                />
                            )}
                        </Field>

                        {/* Requisitioned By */}
                        <Field name="requisitionedBy">
                            {({ field, meta }) => (
                                <MuiTextField
                                    {...field}
                                    label="Requisitioned By"
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    error={meta.touched && Boolean(meta.error)}
                                    helperText={meta.touched && meta.error}
                                />
                            )}
                        </Field>

                        {/* Template Type */}
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Template Type</InputLabel>
                            <Select
                                name="templateType"
                                value={values.templateType}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.templateType && Boolean(errors.templateType)}
                            >
                                <MenuItem value="">Select template type</MenuItem>
                                <MenuItem value="Special Story">Special Story</MenuItem>
                                <MenuItem value="Long Video">Long Video</MenuItem>
                                <MenuItem value="Short Video">Short Video</MenuItem>
                                <MenuItem value="Short Reel">Short Reel</MenuItem>
                            </Select>
                            {touched.templateType && errors.templateType && (
                                <Typography variant="body2" color="error">
                                    {errors.templateType}
                                </Typography>
                            )}
                        </FormControl>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ py: 1.5 }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </Button>
                    </Box>
                </Form>
            )}
        </Formik>
    );
};

export default FormikMaterialForm;
