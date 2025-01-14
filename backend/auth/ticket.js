const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../db');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post(
    '/create-ticket',
    [
        body('topicTeam').notEmpty().withMessage('Topic team is required'),
        body('priority').isIn(['Breaking', 'High', 'Medium', 'Low']).withMessage('Invalid priority'),
        body('topicDescription').notEmpty().withMessage('Topic description is required'),
        body('videoAssetLocations').notEmpty().withMessage('Asset locations are required'),
        body('templateType').isIn(['Special package', 'Long Video', 'Short Video', 'Current Affair content', 'Short reel']).withMessage('Invalid template type'),
    ],
    async (req, res) => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Authorization token missing' });
        }

        try {
            const decoded = jwt.verify(token, 'your_secret_key'); // Replace with your secret
            if (decoded.role !== 'content_producer') {
                return res.status(403).json({ error: 'Access denied. Only content producers can create tickets.' });
            }

            const { topicTeam, priority, topicDescription, videoAssetLocations, templateType } = req.body;
            const requisitionedBy = decoded.id;

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            await pool.query(
                'INSERT INTO form_data (topic_team, priority, topic_description, video_asset_locations, template_type, requisitioned_by) VALUES ($1, $2, $3, $4, $5, $6)',
                [topicTeam, priority, topicDescription, videoAssetLocations, templateType, requisitionedBy]
            );

            res.status(201).json({ message: 'Ticket created successfully!' });
        } catch (error) {
            console.error('Error creating ticket:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

module.exports = router;
