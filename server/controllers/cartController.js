const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const FoodItem = require('../models/FoodItem');

// @desc    Add item to cart (or update quantity)
// @route   POST /api/cart/add
// @access  User
const addToCart = asyncHandler(async (req, res) => {
    const { foodId, quantity } = req.body;
    const userId = req.user._id;

    if (!foodId) {
        res.status(400);
        throw new Error('foodId is required');
    }

    const food = await FoodItem.findById(foodId);
    if (!food) {
        res.status(404);
        throw new Error('Food item not found');
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
        cart = await Cart.create({ userId, items: [{ foodId, quantity: quantity || 1 }] });
    } else {
        const existingItem = cart.items.find((i) => i.foodId.toString() === foodId);
        if (existingItem) {
            existingItem.quantity = existingItem.quantity + (quantity || 1);
            if (existingItem.quantity <= 0) {
                cart.items = cart.items.filter((i) => i.foodId.toString() !== foodId);
            }
        } else {
            cart.items.push({ foodId, quantity: quantity || 1 });
        }
        await cart.save();
    }

    const populated = await Cart.findById(cart._id).populate('items.foodId');
    res.json(populated);
});

// @desc    Get user cart
// @route   GET /api/cart
// @access  User
const getCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.foodId');
    if (!cart) {
        return res.json({ items: [] });
    }
    res.json(cart);
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:foodId
// @access  User
const removeFromCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
        res.status(404);
        throw new Error('Cart not found');
    }

    cart.items = cart.items.filter(
        (item) => item.foodId.toString() !== req.params.foodId
    );
    await cart.save();

    const populated = await Cart.findById(cart._id).populate('items.foodId');
    res.json(populated);
});

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  User
const clearCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (cart) {
        cart.items = [];
        await cart.save();
    }
    res.json({ message: 'Cart cleared' });
});

module.exports = { addToCart, getCart, removeFromCart, clearCart };
