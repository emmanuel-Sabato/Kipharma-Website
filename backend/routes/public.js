const express = require('express');
const Product = require('../models/Product');
const Branch = require('../models/Branch');
const TeamMember = require('../models/TeamMember');
const Partner = require('../models/Partner');
const Career = require('../models/Career');

const router = express.Router();

// @route   GET /api/public/products
// @desc    Get featured/active products for public display
// @access  Public
router.get('/products', async (req, res) => {
    try {
        const { featured, category, limit = 20 } = req.query;
        let query = { isActive: true, status: { $ne: 'Out of Stock' } };

        if (featured === 'true') query.featured = true;
        if (category) query.category = category;

        const products = await Product.find(query)
            .select('name category price image description')
            .limit(parseInt(limit))
            .sort({ featured: -1, createdAt: -1 });

        res.json({ success: true, count: products.length, products });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/public/products/:id
router.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id, isActive: true })
            .select('name category price image description manufacturer');

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/public/categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await Product.distinct('category', { isActive: true });
        res.json({ success: true, categories });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/public/branches
// @desc    Get active branches for public display
// @access  Public
router.get('/branches', async (req, res) => {
    try {
        const branches = await Branch.find({ status: 'Active' })
            .select('name location contact email openingHours');

        res.json({ success: true, count: branches.length, branches });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/public/team
// @desc    Get active team members for public display
// @access  Public
router.get('/team', async (req, res) => {
    try {
        const members = await TeamMember.find({ status: 'Active' })
            .select('name role department image bio socialLinks')
            .sort({ order: 1 });

        res.json({ success: true, count: members.length, members });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/public/partners
// @desc    Get active partners for public display
// @access  Public
router.get('/partners', async (req, res) => {
    try {
        const partners = await Partner.find({ status: 'Active' })
            .select('name type logo website description')
            .sort({ order: 1 });

        res.json({ success: true, count: partners.length, partners });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/public/careers
// @desc    Get open job positions for public display
// @access  Public
router.get('/careers', async (req, res) => {
    try {
        const { type, department } = req.query;
        let query = { status: 'Open' };

        if (type) query.type = type;
        if (department) query.department = department;

        const careers = await Career.find(query)
            .select('title department location type description requirements salary postedDate')
            .sort({ postedDate: -1 });

        res.json({ success: true, count: careers.length, careers });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/public/careers/:id
router.get('/careers/:id', async (req, res) => {
    try {
        const career = await Career.findOne({ _id: req.params.id, status: 'Open' });
        if (!career) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }
        res.json({ success: true, career });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/public/stats
// @desc    Get public statistics
// @access  Public
router.get('/stats', async (req, res) => {
    try {
        const [productsCount, branchesCount, teamCount, partnersCount, careersCount] = await Promise.all([
            Product.countDocuments({ isActive: true }),
            Branch.countDocuments({ status: 'Active' }),
            TeamMember.countDocuments({ status: 'Active' }),
            Partner.countDocuments({ status: 'Active' }),
            Career.countDocuments({ status: 'Open' })
        ]);

        res.json({
            success: true,
            stats: {
                products: productsCount,
                branches: branchesCount,
                team: teamCount,
                partners: partnersCount,
                openPositions: careersCount
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
