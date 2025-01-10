const express = require('express');
const pool = require('../db');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.get('/profile', async (req, res) => {
    
    const token = req.headers.authorization?.split(' ')[1];

    // Log the token for debugging purposes
    console.log('Authenticating user with token:', req.headers.authorization);

    if (!token) {
        return res.status(401).json({ error: 'Authorization token missing' });
    }

    try {
        const decoded = jwt.verify(token, 'your_secret_key'); // Replace with your JWT secret
        console.log('Decoded token:', decoded);  // Log the decoded token for debugging

        // Fetch user data from the database
        const userQuery = await pool.query(
            'SELECT name, email, mobile_number, username FROM users WHERE id = $1',
            [decoded.id]
        );

        if (userQuery.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(userQuery.rows[0]);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



module.exports = router;
