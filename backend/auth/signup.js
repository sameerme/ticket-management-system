const express = require('express');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const pool = require('../db');

const router = express.Router();

router.post(
    '/',
    [
        body('email').isEmail().withMessage('Invalid email format'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        body('username').notEmpty().withMessage('Username is required'),
        body('mobileNumber').isMobilePhone().withMessage('Invalid mobile number'),
    ],
    async (req, res) => {
        const { name, email, mobileNumber, password, username } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // Check if email, username, or mobile number already exists
            const userExists = await pool.query(
                'SELECT * FROM users WHERE email = $1 OR username = $2 OR mobile_number = $3',
                [email, username, mobileNumber]
            );

            if (userExists.rows.length > 0) {
                return res.status(400).json({ error: 'User already exists' });
            }

            // Encrypt the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert the new user
            const result = await pool.query(
                'INSERT INTO users (name, email, mobile_number, password, username) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [name, email, mobileNumber, hashedPassword, username]
            );

            res.status(201).json({ message: 'User registered successfully!', user: result.rows[0] });
        } catch (error) {
            console.error('Error registering user:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

module.exports = router;
