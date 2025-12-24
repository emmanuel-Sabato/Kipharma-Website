require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

// Database connection
const connectDB = require('./config/db');

// Models (for initialization)
const AppSettings = require('./models/AppSettings');
const User = require('./models/User');

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

// Security Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS Configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: {
        success: false,
        message: 'Too many requests, please try again later.'
    }
});
app.use('/api/', limiter);

// Auth routes have stricter rate limiting
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: 'Too many login attempts, please try again after 15 minutes.'
    }
});
app.use('/api/auth/login', authLimiter);

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Logging (development only)
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/users', require('./routes/users'));
app.use('/api/branches', require('./routes/branches'));
app.use('/api/products', require('./routes/products'));
app.use('/api/team', require('./routes/team'));
app.use('/api/partners', require('./routes/partners'));
app.use('/api/careers', require('./routes/careers'));
app.use('/api/notifications', require('./routes/notifications'));

// Public API Routes (no auth required)
app.use('/api/public', require('./routes/public'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Kipharma API is running',
        timestamp: new Date().toISOString()
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err);

    // Multer errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            success: false,
            message: 'File too large. Maximum size is 5MB.'
        });
    }

    // Mongoose validation errors
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            success: false,
            message: messages.join(', ')
        });
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        return res.status(400).json({
            success: false,
            message: 'Duplicate value entered'
        });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Token expired'
        });
    }

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Server Error'
    });
});

// Initialize defaults and start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Initialize default app settings
        await AppSettings.initDefaults();

        // Create default admin if none exists
        await User.createDefaultAdmin();

        app.listen(PORT, () => {
            console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║   🚀 Kipharma API Server                          ║
║                                                   ║
║   Port: ${PORT}                                      ║
║   Mode: ${process.env.NODE_ENV || 'development'}                              ║
║                                                   ║
║   📚 API Endpoints:                               ║
║   - Auth:     /api/auth                           ║
║   - Settings: /api/settings                       ║
║   - Users:    /api/users                          ║
║   - Branches: /api/branches                       ║
║   - Products: /api/products                       ║
║   - Team:     /api/team                           ║
║   - Partners: /api/partners                       ║
║   - Careers:  /api/careers                        ║
║   - Public:   /api/public/*                       ║
║                                                   ║
║   🔑 Default Admin:                               ║
║   Email: admin@kipharma.rw                        ║
║   Pass:  admin123                                 ║
║   Code:  shami                                    ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
            `);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

module.exports = app;
