const Notification = require("../models/notification");

module.exports.getNotifications = async (req, res) => {
    try {
        const limit = req.query.all === '1' ? 100 : 20;
        const notifications = await Notification.find({ recipient: req.user._id })
            .populate('sender', 'username')
            .populate('listing', 'title')
            .sort({ createdAt: -1 })
            .limit(limit);

        // AJAX request from navbar dropdown → return JSON
        const wantsJSON = req.headers['accept'] && req.headers['accept'].includes('application/json');
        if (wantsJSON) return res.json({ notifications });

        // Browser navigation → render full page
        await Notification.updateMany({ recipient: req.user._id, read: false }, { read: true });
        res.render('notifications/index.ejs', { notifications });
    } catch (err) {
        res.status(500).json({ message: "Server error." });
    }
};

module.exports.markAsRead = async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { read: true });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: "Server error." });
    }
};

module.exports.markAllRead = async (req, res) => {
    try {
        await Notification.updateMany({ recipient: req.user._id, read: false }, { read: true });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: "Server error." });
    }
};
