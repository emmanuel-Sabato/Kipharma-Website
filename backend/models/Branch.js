const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Branch name is required'],
        trim: true
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true
    },
    manager: {
        type: String,
        trim: true
    },
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    contact: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        lowercase: true,
        trim: true
    },
    address: {
        street: String,
        city: String,
        district: String
    },
    openingHours: {
        type: String,
        default: '8:00 AM - 8:00 PM'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for products count
branchSchema.virtual('productsCount', {
    ref: 'Product',
    localField: '_id',
    foreignField: 'branchId',
    count: true
});

// Virtual for staff count
branchSchema.virtual('staffCount', {
    ref: 'User',
    localField: '_id',
    foreignField: 'branchId',
    count: true
});

module.exports = mongoose.model('Branch', branchSchema);
