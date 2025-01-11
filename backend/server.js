const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');


// Import the pool object from db.js
const pool = require('./db');

// Import the signup and signin routes
const signupRoutes = require('./auth/signup');
const signinRoutes = require('./auth/signin');
const profileRoutes = require('./auth/profile');
const addUserRoutes = require('./auth/adduser');

const app = express();

// Middleware
app.use(bodyParser.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS for communication between frontend and backend

// Middleware Routes
app.use('/auth/signup', signupRoutes);
app.use('/auth/signin', signinRoutes);
app.use('/auth', profileRoutes);
app.use('/auth', addUserRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Redirect root ("/") to /signin (handled by React)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// Catch-all route to serve React app for unhandled frontend routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// Example route to handle form submissions
app.post('/submit-form', async (req, res) => {
    const { topicTeam, priority, topicDescription, videoAssetLocations, requisitionedBy, templateType } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO form_data (topic_team, priority, topic_description, video_asset_locations, requisitioned_by, template_type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [topicTeam, priority, topicDescription, videoAssetLocations, requisitionedBy, templateType]
        );
        res.status(201).json({ message: 'Form submitted successfully!', data: result.rows[0] });
        console.log('Received form data:', req.body);
    } catch (error) {
        console.error('Error inserting form data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
