const express = require('express');
const { body, validationResult } = require('express-validator');
const TeamMember = require('../models/TeamMember');
const { protect, adminOnly } = require('../middleware/auth');
const { uploadTeam, deleteImage } = require('../config/cloudinary');

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/team
// @desc    Get all team members
// @access  Private
router.get('/', async (req, res) => {
    try {
        const { status, department, search } = req.query;
        let query = {};

        if (status) query.status = status;
        if (department) query.department = department;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { role: { $regex: search, $options: 'i' } },
                { department: { $regex: search, $options: 'i' } }
            ];
        }

        const members = await TeamMember.find(query).sort({ order: 1, createdAt: -1 });

        res.json({
            success: true,
            count: members.length,
            members
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/team/:id
// @desc    Get team member by ID
// @access  Private
router.get('/:id', async (req, res) => {
    try {
        const member = await TeamMember.findById(req.params.id);
        if (!member) {
            return res.status(404).json({ success: false, message: 'Team member not found' });
        }
        res.json({ success: true, member });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/team
// @desc    Create team member with image
// @access  Private/Admin
router.post('/', [
    adminOnly,
    uploadTeam.single('image'),
    body('name').notEmpty().withMessage('Name is required'),
    body('role').notEmpty().withMessage('Role is required'),
    body('department').notEmpty().withMessage('Department is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const memberData = { ...req.body };

        if (req.file) {
            memberData.image = req.file.path;
            memberData.imagePublicId = req.file.filename;
        }

        const member = await TeamMember.create(memberData);
        res.status(201).json({ success: true, message: 'Team member added', member });
    } catch (error) {
        console.error('Create team error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   PUT /api/team/:id
// @desc    Update team member
// @access  Private/Admin
router.put('/:id', [adminOnly, uploadTeam.single('image')], async (req, res) => {
    try {
        let member = await TeamMember.findById(req.params.id);
        if (!member) {
            return res.status(404).json({ success: false, message: 'Team member not found' });
        }

        const updateData = { ...req.body };

        if (req.file) {
            if (member.imagePublicId) {
                await deleteImage(member.imagePublicId);
            }
            updateData.image = req.file.path;
            updateData.imagePublicId = req.file.filename;
        }

        member = await TeamMember.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        res.json({ success: true, message: 'Team member updated', member });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   DELETE /api/team/:id
// @desc    Delete team member
// @access  Private/Admin
router.delete('/:id', adminOnly, async (req, res) => {
    try {
        const member = await TeamMember.findById(req.params.id);
        if (!member) {
            return res.status(404).json({ success: false, message: 'Team member not found' });
        }

        if (member.imagePublicId) {
            await deleteImage(member.imagePublicId);
        }

        await TeamMember.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Team member deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/team/departments/list
// @desc    Get unique departments
// @access  Private
router.get('/departments/list', async (req, res) => {
    try {
        const departments = await TeamMember.distinct('department');
        res.json({ success: true, departments });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
