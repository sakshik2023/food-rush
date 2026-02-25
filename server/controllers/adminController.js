const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
});

// @desc    Update user role
// @route   PATCH /api/admin/users/:id/role
// @access  Admin
const updateUserRole = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Prevent demoting yourself
    if (req.user._id.toString() === user._id.toString()) {
        res.status(400);
        throw new Error('You cannot change your own role');
    }

    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
        res.status(400);
        throw new Error('Invalid role');
    }

    user.role = role;
    const updated = await user.save();
    res.json({ _id: updated._id, name: updated.name, email: updated.email, role: updated.role });
});

module.exports = { getAllUsers, updateUserRole };
