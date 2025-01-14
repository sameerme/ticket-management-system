const express = require('express');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const pool = require('../db');
const jwt = require('jsonwebtoken');

const router = express.Router();
const SECRET_KEY = 'your_secret_key'; // Replace with an environment variable

router.post(
    '/',
    [
        body('username').notEmpty().withMessage('Username is required'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    async (req, res) => {
        const { username, password } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // Find user by username
            const userQuery = await pool.query(
                'SELECT id, username, password, role FROM users WHERE username = $1',
                [username]
            );

            if (userQuery.rows.length === 0) {
                return res.status(400).json({ error: 'Invalid credentials' });
            }

            const user = userQuery.rows[0];

            // Compare passwords
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ error: 'Invalid credentials' });
            }

            // Generate JWT including the user's role
            const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });

            res.status(200).json({ message: 'Logged in successfully!', token });
        } catch (error) {
            console.error('Error during sign-in:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

module.exports = router;
