const express = require('express');
const router = express.Router();
const { addToCart, getCart, removeFromCart, clearCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getCart);
router.post('/add', protect, addToCart);
router.delete('/clear', protect, clearCart);
router.delete('/remove/:foodId', protect, removeFromCart);

module.exports = router;
