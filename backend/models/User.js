const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    role: {
        type: String,
        enum: ['Admin', 'Manager', 'Pharmacist', 'Staff'],
        default: 'Staff'
    },
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch'
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    phone: {
        type: String,
        trim: true
    },
    avatar: String,
    lastLogin: Date,
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    this.passwordChangedAt = Date.now() - 1000;
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Check if password was changed after token was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};

// Virtual for branch info
userSchema.virtual('branch', {
    ref: 'Branch',
    localField: 'branchId',
    foreignField: '_id',
    justOne: true
});

// Create default admin if none exists
userSchema.statics.createDefaultAdmin = async function () {
    const adminExists = await this.findOne({ role: 'Admin' });
    if (!adminExists) {
        await this.create({
            name: 'Admin',
            email: 'admin@kipharma.rw',
            password: 'admin123',
            role: 'Admin',
            status: 'Active',
            phone: '+250 788 000 000'
        });
        console.log('✅ Default admin created (email: admin@kipharma.rw, password: admin123)');
    }
};

module.exports = mongoose.model('User', userSchema);
