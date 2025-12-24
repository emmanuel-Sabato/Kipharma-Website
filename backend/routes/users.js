const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(adminOnly);

// @route   GET /api/users
router.get('/', async (req, res) => {
    try {
        const { role, status, branchId, search } = req.query;
        let query = {};

        if (role) query.role = role;
        if (status) query.status = status;
        if (branchId) query.branchId = branchId;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(query)
            .select('-password')
            .populate('branchId', 'name location')
            .sort({ createdAt: -1 });

        res.json({ success: true, count: users.length, users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/users/:id
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password').populate('branchId');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/users
router.post('/', [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['Admin', 'Manager', 'Pharmacist', 'Staff'])
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        // Check if email exists
        const exists = await User.findOne({ email: req.body.email });
        if (exists) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        const user = await User.create(req.body);
        res.status(201).json({
            success: true,
            message: 'User created',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status
            }
        });
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   PUT /api/users/:id
router.put('/:id', async (req, res) => {
    try {
        // Prevent password update through this route
        delete req.body.password;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, message: 'User updated', user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   DELETE /api/users/:id
router.delete('/:id', async (req, res) => {
    try {
        // Prevent self-deletion
        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({ success: false, message: 'Cannot delete yourself' });
        }

        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   PUT /api/users/:id/reset-password
router.put('/:id/reset-password', [
    body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.password = req.body.newPassword;
        await user.save();

        res.json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
