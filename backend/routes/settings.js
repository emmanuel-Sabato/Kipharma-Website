const express = require('express');
const { body, validationResult } = require('express-validator');
const AppSettings = require('../models/AppSettings');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/settings
// @desc    Get all settings (admin only)
// @access  Private/Admin
router.get('/', adminOnly, async (req, res) => {
    try {
        const settings = await AppSettings.find().select('-__v');
        res.json({
            success: true,
            settings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/settings/:key
// @desc    Get a specific setting
// @access  Private/Admin
router.get('/:key', adminOnly, async (req, res) => {
    try {
        const value = await AppSettings.getSetting(req.params.key);
        if (value === null) {
            return res.status(404).json({
                success: false,
                message: 'Setting not found'
            });
        }
        res.json({
            success: true,
            key: req.params.key,
            value
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   PUT /api/settings/portal-code
// @desc    Update portal access code
// @access  Private/Admin
router.put('/portal-code', [
    adminOnly,
    body('code').isLength({ min: 4 }).withMessage('Access code must be at least 4 characters')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { code } = req.body;

        await AppSettings.setSetting(
            'portalAccessCode',
            code,
            'Staff portal access code required for login',
            req.user._id
        );

        res.json({
            success: true,
            message: 'Portal access code updated successfully. Share the new code with your staff.'
        });

    } catch (error) {
        console.error('Update portal code error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   PUT /api/settings/:key
// @desc    Update a setting
// @access  Private/Admin
router.put('/:key', [
    adminOnly,
    body('value').notEmpty().withMessage('Value is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { value, description } = req.body;

        await AppSettings.setSetting(
            req.params.key,
            value,
            description || '',
            req.user._id
        );

        res.json({
            success: true,
            message: 'Setting updated successfully'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;
