const asyncHandler = require('express-async-handler');
const Restaurant = require('../models/Restaurant');

// Helper: parse boolean that may arrive as string from JSON body
const parseBool = (val, fallback) => {
    if (val === undefined || val === null) return fallback;
    if (typeof val === 'boolean') return val;
    return val === 'true' || val === true;
};

// @desc    Create restaurant
// @route   POST /api/restaurants
// @access  Admin
const createRestaurant = asyncHandler(async (req, res) => {
    const { name, description, address, isActive, image } = req.body;

    const restaurant = await Restaurant.create({
        name,
        image: image || '',
        description,
        address,
        isActive: parseBool(isActive, true),
    });

    res.status(201).json(restaurant);
});

// @desc    Get all restaurants
// @route   GET /api/restaurants
// @access  Public
const getRestaurants = asyncHandler(async (req, res) => {
    const restaurants = await Restaurant.find().sort({ createdAt: -1 });
    res.json(restaurants);
});

// @desc    Get single restaurant
// @route   GET /api/restaurants/:id
// @access  Public
const getRestaurantById = asyncHandler(async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
        res.status(404);
        throw new Error('Restaurant not found');
    }
    res.json(restaurant);
});

// @desc    Update restaurant
// @route   PUT /api/restaurants/:id
// @access  Admin
const updateRestaurant = asyncHandler(async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
        res.status(404);
        throw new Error('Restaurant not found');
    }

    const { name, description, address, isActive, image } = req.body;

    restaurant.name = name || restaurant.name;
    restaurant.description = description !== undefined ? description : restaurant.description;
    restaurant.address = address || restaurant.address;
    restaurant.image = image !== undefined ? image : restaurant.image;
    restaurant.isActive = parseBool(isActive, restaurant.isActive);

    const updated = await restaurant.save();
    res.json(updated);
});

// @desc    Delete restaurant
// @route   DELETE /api/restaurants/:id
// @access  Admin
const deleteRestaurant = asyncHandler(async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
        res.status(404);
        throw new Error('Restaurant not found');
    }
    await restaurant.deleteOne();
    res.json({ message: 'Restaurant removed' });
});

module.exports = {
    createRestaurant,
    getRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant,
};
