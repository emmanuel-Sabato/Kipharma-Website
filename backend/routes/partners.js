const express = require('express');
const { body, validationResult } = require('express-validator');
const Partner = require('../models/Partner');
const { protect, adminOnly } = require('../middleware/auth');
const { uploadPartner, deleteImage } = require('../config/cloudinary');

const router = express.Router();

router.use(protect);

// @route   GET /api/partners
// @desc    Get all partners
router.get('/', async (req, res) => {
    try {
        const { status, type, search } = req.query;
        let query = {};

        if (status) query.status = status;
        if (type) query.type = type;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { contactPerson: { $regex: search, $options: 'i' } }
            ];
        }

        const partners = await Partner.find(query).sort({ order: 1, createdAt: -1 });
        res.json({ success: true, count: partners.length, partners });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/partners/:id
router.get('/:id', async (req, res) => {
    try {
        const partner = await Partner.findById(req.params.id);
        if (!partner) {
            return res.status(404).json({ success: false, message: 'Partner not found' });
        }
        res.json({ success: true, partner });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/partners
router.post('/', [
    adminOnly,
    uploadPartner.single('logo'),
    body('name').notEmpty().withMessage('Partner name is required'),
    body('type').isIn(['Supplier', 'Distributor', 'Healthcare', 'Technology', 'Other'])
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const partnerData = { ...req.body };

        if (req.file) {
            partnerData.logo = req.file.path;
            partnerData.logoPublicId = req.file.filename;
        }

        const partner = await Partner.create(partnerData);
        res.status(201).json({ success: true, message: 'Partner added', partner });
    } catch (error) {
        console.error('Create partner error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   PUT /api/partners/:id
router.put('/:id', [adminOnly, uploadPartner.single('logo')], async (req, res) => {
    try {
        let partner = await Partner.findById(req.params.id);
        if (!partner) {
            return res.status(404).json({ success: false, message: 'Partner not found' });
        }

        const updateData = { ...req.body };

        if (req.file) {
            if (partner.logoPublicId) {
                await deleteImage(partner.logoPublicId);
            }
            updateData.logo = req.file.path;
            updateData.logoPublicId = req.file.filename;
        }

        partner = await Partner.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        res.json({ success: true, message: 'Partner updated', partner });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   DELETE /api/partners/:id
router.delete('/:id', adminOnly, async (req, res) => {
    try {
        const partner = await Partner.findById(req.params.id);
        if (!partner) {
            return res.status(404).json({ success: false, message: 'Partner not found' });
        }

        if (partner.logoPublicId) {
            await deleteImage(partner.logoPublicId);
        }

        await Partner.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Partner deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
