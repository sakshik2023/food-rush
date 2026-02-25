const express = require('express');
const router = express.Router();
const {
    createFoodItem,
    getFoodsByRestaurant,
    getAllFoods,
    updateFoodItem,
    deleteFoodItem,
} = require('../controllers/foodController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getAllFoods);               // GET all foods (for global search)
router.get('/:restaurantId', getFoodsByRestaurant);
router.post('/:restaurantId', protect, adminOnly, createFoodItem);
router.put('/:id', protect, adminOnly, updateFoodItem);
router.delete('/:id', protect, adminOnly, deleteFoodItem);

module.exports = router;
