const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Partner name is required'],
        trim: true
    },
    type: {
        type: String,
        enum: ['Supplier', 'Distributor', 'Healthcare', 'Technology', 'Other'],
        required: [true, 'Partner type is required']
    },
    logo: {
        type: String,
        default: ''
    },
    logoPublicId: String,
    website: {
        type: String,
        trim: true
    },
    contactPerson: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    description: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Sort by order by default
partnerSchema.index({ order: 1 });

module.exports = mongoose.model('Partner', partnerSchema);
