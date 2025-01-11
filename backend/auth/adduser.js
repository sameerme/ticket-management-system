const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const pool = require('../db');

const router = express.Router();

router.post(
    '/adduser',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Invalid email format'),
        body('mobileNumber').isMobilePhone().withMessage('Invalid mobile number'),
        body('username').notEmpty().withMessage('Username is required'),
        body('password')
            .isLength({ min: 6 })
            .matches(/^(?=.*[a-zA-Z])(?=.*[!@#$%^&*]).*$/)
            .withMessage('Password must be at least 6 characters long with one special character'),
        body('role')
            .isIn(['admin', 'content_producer', 'video_editor', 'graphic_designer'])
            .withMessage('Invalid role'),
    ],
    async (req, res) => {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Authorization token missing' });
        }

        try {
            // Decode the token and check the role
            const decoded = jwt.verify(token, 'your_secret_key'); // Replace with your JWT secret
            if (decoded.role !== 'admin') {
                return res.status(403).json({ error: 'Access denied. Only admin users can add new users.' });
            }

            const { name, email, mobileNumber, username, password, role } = req.body;

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // Check if username or email already exists
            const existingUser = await pool.query(
                'SELECT * FROM users WHERE email = $1 OR username = $2',
                [email, username]
            );
            if (existingUser.rows.length > 0) {
                return res.status(400).json({ error: 'User already exists' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert the new user
            await pool.query(
                'INSERT INTO users (name, email, mobile_number, username, password, role) VALUES ($1, $2, $3, $4, $5, $6)',
                [name, email, mobileNumber, username, hashedPassword, role]
            );

            res.status(201).json({ message: 'User added successfully!' });
        } catch (error) {
            console.error('Error adding user:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

module.exports = router;
