const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    role: {
        type: String,
        required: [true, 'Role is required'],
        trim: true
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
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
    image: {
        type: String,
        default: ''
    },
    imagePublicId: String,
    bio: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    socialLinks: {
        linkedin: String,
        twitter: String
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Sort by order by default
teamMemberSchema.index({ order: 1 });

module.exports = mongoose.model('TeamMember', teamMemberSchema);
