const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const FoodItem = require('../models/FoodItem');

// @desc    Place an order
// @route   POST /api/orders
// @access  User
const placeOrder = asyncHandler(async (req, res) => {
    const { deliveryAddress, paymentMethod } = req.body;
    const userId = req.user._id;

    if (!deliveryAddress) {
        res.status(400);
        throw new Error('Delivery address is required');
    }

    const cart = await Cart.findOne({ userId }).populate('items.foodId');
    if (!cart || cart.items.length === 0) {
        res.status(400);
        throw new Error('Cart is empty');
    }

    // Build order items as snapshot
    let totalAmount = 0;
    const orderItems = cart.items.map((item) => {
        const food = item.foodId;
        const subtotal = food.price * item.quantity;
        totalAmount += subtotal;
        return {
            foodId: food._id,
            name: food.name,
            price: food.price,
            quantity: item.quantity,
            image: food.image,
        };
    });

    const order = await Order.create({
        userId,
        items: orderItems,
        totalAmount,
        deliveryAddress,
        paymentMethod: paymentMethod || 'COD',
        status: 'Pending',
    });

    // Clear cart after ordering
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
});

// @desc    Get logged-in user orders
// @route   GET /api/orders/user
// @access  User
const getUserOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
});

// @desc    Get all orders (admin)
// @route   GET /api/orders/admin
// @access  Admin
const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find()
        .populate('userId', 'name email')
        .sort({ createdAt: -1 });
    res.json(orders);
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(status)) {
        res.status(400);
        throw new Error('Invalid status');
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    order.status = status;
    const updated = await order.save();
    res.json(updated);
});

module.exports = { placeOrder, getUserOrders, getAllOrders, updateOrderStatus };
