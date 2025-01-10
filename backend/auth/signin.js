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
            const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

            if (user.rows.length === 0) {
                return res.status(400).json({ error: 'Invalid credentials' });
            }

            // Compare passwords
            const isMatch = await bcrypt.compare(password, user.rows[0].password);

            if (!isMatch) {
                return res.status(400).json({ error: 'Invalid credentials' });
            }

            // Generate JWT
            const token = jwt.sign({ id: user.rows[0].id }, SECRET_KEY, { expiresIn: '1h' });

            res.status(200).json({ message: 'Logged in successfully!', token });
        } catch (error) {
            console.error('Error during sign-in:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

module.exports = router;
