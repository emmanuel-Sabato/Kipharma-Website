const express = require('express');
const { body, validationResult } = require('express-validator');
const Branch = require('../models/Branch');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/branches
// @desc    Get all branches
// @access  Private
router.get('/', async (req, res) => {
    try {
        const { status, search } = req.query;
        let query = {};

        if (status) query.status = status;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } }
            ];
        }

        const branches = await Branch.find(query)
            .populate('productsCount')
            .populate('staffCount')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: branches.length,
            branches
        });
    } catch (error) {
        console.error('Get branches error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/branches/:id
// @desc    Get branch by ID
// @access  Private
router.get('/:id', async (req, res) => {
    try {
        const branch = await Branch.findById(req.params.id)
            .populate('productsCount')
            .populate('staffCount');

        if (!branch) {
            return res.status(404).json({ success: false, message: 'Branch not found' });
        }

        res.json({ success: true, branch });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/branches
// @desc    Create branch
// @access  Private/Admin
router.post('/', [
    adminOnly,
    body('name').notEmpty().withMessage('Branch name is required'),
    body('location').notEmpty().withMessage('Location is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const branch = await Branch.create(req.body);
        res.status(201).json({ success: true, message: 'Branch created', branch });
    } catch (error) {
        console.error('Create branch error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   PUT /api/branches/:id
// @desc    Update branch
// @access  Private/Admin
router.put('/:id', adminOnly, async (req, res) => {
    try {
        const branch = await Branch.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!branch) {
            return res.status(404).json({ success: false, message: 'Branch not found' });
        }

        res.json({ success: true, message: 'Branch updated', branch });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   DELETE /api/branches/:id
// @desc    Delete branch
// @access  Private/Admin
router.delete('/:id', adminOnly, async (req, res) => {
    try {
        const branch = await Branch.findByIdAndDelete(req.params.id);

        if (!branch) {
            return res.status(404).json({ success: false, message: 'Branch not found' });
        }

        res.json({ success: true, message: 'Branch deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
