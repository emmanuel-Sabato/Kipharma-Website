const express = require('express');
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const { protect, adminOnly, managerOrAdmin } = require('../middleware/auth');
const { uploadProduct, deleteImage, getPublicIdFromUrl } = require('../config/cloudinary');

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/products
// @desc    Get all products
// @access  Private
router.get('/', async (req, res) => {
    try {
        const { status, category, branchId, search, featured } = req.query;
        let query = { isActive: true };

        if (status) query.status = status;
        if (category) query.category = category;
        if (branchId) query.branchId = branchId;
        if (featured === 'true') query.featured = true;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // If manager, only show their branch products
        if (req.user.role === 'Manager' && req.user.branchId) {
            query.branchId = req.user.branchId;
        }

        const products = await Product.find(query)
            .populate('branch', 'name location')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: products.length,
            products
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/products/:id
// @desc    Get product by ID
// @access  Private
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('branch');

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/products
// @desc    Create product with image upload
// @access  Private/Admin
router.post('/', [
    adminOnly,
    uploadProduct.single('image'),
    body('name').notEmpty().withMessage('Product name is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('price').isNumeric().withMessage('Valid price is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const productData = { ...req.body };

        // Handle image upload
        if (req.file) {
            productData.image = req.file.path;
            productData.imagePublicId = req.file.filename;
        }

        const product = await Product.create(productData);
        res.status(201).json({ success: true, message: 'Product created', product });
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private/Admin
router.put('/:id', [adminOnly, uploadProduct.single('image')], async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const updateData = { ...req.body };

        // Handle image update
        if (req.file) {
            // Delete old image from Cloudinary
            if (product.imagePublicId) {
                await deleteImage(product.imagePublicId);
            }
            updateData.image = req.file.path;
            updateData.imagePublicId = req.file.filename;
        }

        product = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        res.json({ success: true, message: 'Product updated', product });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   PATCH /api/products/:id/stock
// @desc    Update product stock (for managers)
// @access  Private/Manager or Admin
router.patch('/:id/stock', managerOrAdmin, async (req, res) => {
    try {
        const { stock, adjustment, type } = req.body;

        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Check if manager owns this product's branch
        if (req.user.role === 'Manager') {
            if (product.branchId.toString() !== req.user.branchId.toString()) {
                return res.status(403).json({ success: false, message: 'Not authorized for this branch' });
            }
        }

        // Update stock
        if (adjustment !== undefined) {
            if (type === 'in') {
                product.stock += Number(adjustment);
            } else if (type === 'out') {
                product.stock = Math.max(0, product.stock - Number(adjustment));
            }
        } else if (stock !== undefined) {
            product.stock = Number(stock);
        }

        await product.save();

        res.json({ success: true, message: 'Stock updated', product });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Private/Admin
router.delete('/:id', adminOnly, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Delete image from Cloudinary
        if (product.imagePublicId) {
            await deleteImage(product.imagePublicId);
        }

        await Product.findByIdAndDelete(req.params.id);

        res.json({ success: true, message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/products/categories/list
// @desc    Get unique categories
// @access  Private
router.get('/categories/list', async (req, res) => {
    try {
        const categories = await Product.distinct('category', { isActive: true });
        res.json({ success: true, categories });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
