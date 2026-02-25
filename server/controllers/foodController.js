const asyncHandler = require('express-async-handler');
const FoodItem = require('../models/FoodItem');
const Restaurant = require('../models/Restaurant');

// Helper: parse boolean that may arrive as string from JSON body
const parseBool = (val, fallback) => {
    if (val === undefined || val === null) return fallback;
    if (typeof val === 'boolean') return val;
    return val === 'true' || val === true;
};

// @desc    Create food item for a restaurant
// @route   POST /api/foods/:restaurantId
// @access  Admin
const createFoodItem = asyncHandler(async (req, res) => {
    const { name, price, category, isAvailable, image } = req.body;
    const { restaurantId } = req.params;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
        res.status(404);
        throw new Error('Restaurant not found');
    }

    const food = await FoodItem.create({
        restaurantId,
        name,
        image: image || '',
        price,
        category,
        isAvailable: parseBool(isAvailable, true),
    });

    res.status(201).json(food);
});

// @desc    Get food items by restaurant
// @route   GET /api/foods/:restaurantId
// @access  Public
const getFoodsByRestaurant = asyncHandler(async (req, res) => {
    const foods = await FoodItem.find({ restaurantId: req.params.restaurantId }).sort({ createdAt: -1 });
    res.json(foods);
});

// @desc    Get all food items (with restaurant info) — for global search
// @route   GET /api/foods
// @access  Public
const getAllFoods = asyncHandler(async (req, res) => {
    const foods = await FoodItem.find({}).populate('restaurantId', 'name _id isActive').sort({ createdAt: -1 });
    res.json(foods);
});

// @desc    Update food item
// @route   PUT /api/foods/:id
// @access  Admin
const updateFoodItem = asyncHandler(async (req, res) => {
    const food = await FoodItem.findById(req.params.id);
    if (!food) {
        res.status(404);
        throw new Error('Food item not found');
    }

    const { name, price, category, isAvailable, image } = req.body;

    food.name = name || food.name;
    food.image = image !== undefined ? image : food.image;
    food.price = price !== undefined ? price : food.price;
    food.category = category !== undefined ? category : food.category;
    food.isAvailable = parseBool(isAvailable, food.isAvailable);

    const updated = await food.save();
    res.json(updated);
});

// @desc    Delete food item
// @route   DELETE /api/foods/:id
// @access  Admin
const deleteFoodItem = asyncHandler(async (req, res) => {
    const food = await FoodItem.findById(req.params.id);
    if (!food) {
        res.status(404);
        throw new Error('Food item not found');
    }
    await food.deleteOne();
    res.json({ message: 'Food item removed' });
});

module.exports = { createFoodItem, getFoodsByRestaurant, getAllFoods, updateFoodItem, deleteFoodItem };
