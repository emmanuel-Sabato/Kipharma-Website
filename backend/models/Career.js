const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Job title is required'],
        trim: true
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
        trim: true
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true
    },
    type: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
        required: [true, 'Job type is required']
    },
    description: {
        type: String,
        required: [true, 'Job description is required']
    },
    requirements: {
        type: String,
        required: [true, 'Requirements are required']
    },
    responsibilities: {
        type: String
    },
    salary: {
        type: String,
        trim: true
    },
    benefits: {
        type: String
    },
    postedDate: {
        type: Date,
        default: Date.now
    },
    closingDate: Date,
    status: {
        type: String,
        enum: ['Open', 'Closed'],
        default: 'Open'
    },
    applicationsCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Auto-close job if past closing date
careerSchema.pre('save', function (next) {
    if (this.closingDate && new Date() > this.closingDate) {
        this.status = 'Closed';
    }
    next();
});

// Index for filtering
careerSchema.index({ status: 1, type: 1, department: 1 });

module.exports = mongoose.model('Career', careerSchema);
