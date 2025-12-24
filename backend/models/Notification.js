const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['low_stock', 'new_order', 'user_action', 'system', 'general'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    productName: String,
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch'
    },
    branchName: String,
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    managerName: String,
    currentStock: Number,
    read: {
        type: Boolean,
        default: false
    },
    readAt: Date,
    readBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    forRole: {
        type: String,
        enum: ['Admin', 'Manager', 'All'],
        default: 'Admin'
    }
}, {
    timestamps: true
});

// Sort by newest first
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ read: 1, forRole: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
