const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
        min: [0, 'Stock cannot be negative']
    },
    lowStockThreshold: {
        type: Number,
        default: 50
    },
    status: {
        type: String,
        enum: ['In Stock', 'Low Stock', 'Out of Stock'],
        default: 'In Stock'
    },
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch'
    },
    image: {
        type: String,
        default: ''
    },
    imagePublicId: String,
    sku: {
        type: String,
        trim: true
    },
    manufacturer: {
        type: String,
        trim: true
    },
    expiryDate: Date,
    featured: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Auto-update status based on stock
productSchema.pre('save', function (next) {
    if (this.stock <= 0) {
        this.status = 'Out of Stock';
    } else if (this.stock <= this.lowStockThreshold) {
        this.status = 'Low Stock';
    } else {
        this.status = 'In Stock';
    }
    next();
});

// Virtual for branch info
productSchema.virtual('branch', {
    ref: 'Branch',
    localField: 'branchId',
    foreignField: '_id',
    justOne: true
});

// Text index for search
productSchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema);
