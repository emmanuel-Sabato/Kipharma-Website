const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
const protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        // Check for token in cookies
        else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized. Please login.'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if user still exists
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User no longer exists.'
            });
        }

        // Check if user changed password after token was issued
        if (user.changedPasswordAfter && user.changedPasswordAfter(decoded.iat)) {
            return res.status(401).json({
                success: false,
                message: 'Password recently changed. Please login again.'
            });
        }

        // Check if user is active
        if (user.status !== 'Active') {
            return res.status(401).json({
                success: false,
                message: 'Your account is inactive. Contact admin.'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth error:', error.message);
        return res.status(401).json({
            success: false,
            message: 'Not authorized. Invalid token.'
        });
    }
};

// Restrict to specific roles
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to perform this action.'
            });
        }
        next();
    };
};

// Admin only middleware
const adminOnly = restrictTo('Admin');

// Manager or Admin middleware
const managerOrAdmin = restrictTo('Admin', 'Manager');

module.exports = { protect, restrictTo, adminOnly, managerOrAdmin };
