const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserRole } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect, adminOnly); // all admin routes require login + admin role

router.get('/users', getAllUsers);
router.patch('/users/:id/role', updateUserRole);

module.exports = router;
