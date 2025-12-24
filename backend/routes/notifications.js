const express = require('express');
const Notification = require('../models/Notification');
const { protect, adminOnly, managerOrAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

// @route   GET /api/notifications
router.get('/', async (req, res) => {
    try {
        const { read, limit = 50 } = req.query;
        let query = {};

        // Filter by role
        if (req.user.role === 'Admin') {
            query.$or = [{ forRole: 'Admin' }, { forRole: 'All' }];
        } else if (req.user.role === 'Manager') {
            query.$or = [
                { forRole: 'Manager' },
                { forRole: 'All' },
                { managerId: req.user._id }
            ];
        }

        if (read !== undefined) query.read = read === 'true';

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        const unreadCount = await Notification.countDocuments({ ...query, read: false });

        res.json({
            success: true,
            count: notifications.length,
            unreadCount,
            notifications
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   PUT /api/notifications/:id/read
router.put('/:id/read', async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { read: true, readAt: new Date(), readBy: req.user._id },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        res.json({ success: true, notification });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   PUT /api/notifications/read-all
router.put('/read-all', async (req, res) => {
    try {
        let query = { read: false };

        if (req.user.role === 'Admin') {
            query.$or = [{ forRole: 'Admin' }, { forRole: 'All' }];
        } else {
            query.$or = [{ forRole: 'Manager' }, { forRole: 'All' }, { managerId: req.user._id }];
        }

        await Notification.updateMany(query, {
            read: true,
            readAt: new Date(),
            readBy: req.user._id
        });

        res.json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   DELETE /api/notifications/:id
router.delete('/:id', managerOrAdmin, async (req, res) => {
    try {
        await Notification.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Notification deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/notifications
// @desc    Create notification (for low stock alerts etc)
router.post('/', managerOrAdmin, async (req, res) => {
    try {
        const notification = await Notification.create({
            ...req.body,
            managerId: req.user._id,
            managerName: req.user.name
        });

        res.status(201).json({ success: true, notification });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
