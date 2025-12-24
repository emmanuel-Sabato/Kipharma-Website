const express = require('express');
const { body, validationResult } = require('express-validator');
const Career = require('../models/Career');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

// @route   GET /api/careers
router.get('/', async (req, res) => {
    try {
        const { status, type, department, search } = req.query;
        let query = {};

        if (status) query.status = status;
        if (type) query.type = type;
        if (department) query.department = department;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { department: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } }
            ];
        }

        const careers = await Career.find(query).sort({ postedDate: -1 });
        res.json({ success: true, count: careers.length, careers });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/careers/:id
router.get('/:id', async (req, res) => {
    try {
        const career = await Career.findById(req.params.id);
        if (!career) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }
        res.json({ success: true, career });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/careers
router.post('/', [
    adminOnly,
    body('title').notEmpty().withMessage('Job title is required'),
    body('department').notEmpty().withMessage('Department is required'),
    body('location').notEmpty().withMessage('Location is required'),
    body('type').isIn(['Full-time', 'Part-time', 'Contract', 'Internship']),
    body('description').notEmpty().withMessage('Description is required'),
    body('requirements').notEmpty().withMessage('Requirements are required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const career = await Career.create(req.body);
        res.status(201).json({ success: true, message: 'Job posted', career });
    } catch (error) {
        console.error('Create career error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   PUT /api/careers/:id
router.put('/:id', adminOnly, async (req, res) => {
    try {
        const career = await Career.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!career) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        res.json({ success: true, message: 'Job updated', career });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   DELETE /api/careers/:id
router.delete('/:id', adminOnly, async (req, res) => {
    try {
        const career = await Career.findByIdAndDelete(req.params.id);
        if (!career) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }
        res.json({ success: true, message: 'Job deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
