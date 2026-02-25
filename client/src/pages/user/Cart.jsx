import { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Cart = () => {
    const { cart, addToCart, removeFromCart, getTotal } = useCart();
    const navigate = useNavigate();

    const items = cart?.items || [];

    const handleQuantity = async (foodId, delta) => {
        // delta = +1 ya -1 — backend quantity ko ADD karta hai, isliye absolute mat bhejo
        try {
            if (delta < 0) {
                const item = items.find((i) => (i.foodId?._id || i.foodId)?.toString() === foodId);
                if (item && item.quantity === 1) {
                    await removeFromCart(foodId);
                } else {
                    await addToCart(foodId, -1);
                }
            } else {
                await addToCart(foodId, 1);
            }
        } catch {
            toast.error('Failed to update cart');
        }
    };

    const handleRemove = async (foodId) => {
        try {
            await removeFromCart(foodId);
            toast.success('Item removed');
        } catch {
            toast.error('Failed to remove item');
        }
    };

    if (items.length === 0) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                <div className="text-6xl mb-4">🛒</div>
                <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
                <p className="text-white/50 mb-6">Browse restaurants and add items to get started.</p>
                <Link to="/" className="btn-primary">Browse Restaurants</Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-white mb-8">🛒 Your Cart</h1>
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Cart items */}
                <div className="flex-1 space-y-4">
                    {items.map((item) => {
                        const food = item.foodId;
                        if (!food) return null;
                        const placeholder = `https://ui-avatars.com/api/?name=${encodeURIComponent(food.name)}&background=1a1d27&color=ff6b35&size=80`;
                        return (
                            <div key={item._id || food._id} className="card p-4 flex items-center gap-4">
                                <img
                                    src={food.image || placeholder}
                                    alt={food.name}
                                    className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                                    onError={(e) => { e.target.src = placeholder; }}
                                />
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-white truncate">{food.name}</h4>
                                    <p className="text-orange-400 font-bold">₹{food.price}</p>
                                </div>
                                {/* Quantity controls */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleQuantity(food._id, -1)}
                                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold transition-colors"
                                    >−</button>
                                    <span className="w-6 text-center font-semibold text-white">{item.quantity}</span>
                                    <button
                                        onClick={() => handleQuantity(food._id, +1)}
                                        className="w-8 h-8 rounded-full bg-orange-500 hover:bg-orange-400 text-white flex items-center justify-center font-bold transition-colors"
                                    >+</button>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-white">₹{(food.price * item.quantity).toFixed(2)}</p>
                                    <button onClick={() => handleRemove(food._id)} className="text-red-400 hover:text-red-300 text-xs mt-1">Remove</button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Summary */}
                <div className="lg:w-72">
                    <div className="card p-6 sticky top-20">
                        <h3 className="text-lg font-bold text-white mb-4">Order Summary</h3>
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-white/70 text-sm">
                                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                                <span>₹{getTotal().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-white/70 text-sm">
                                <span>Delivery Fee</span>
                                <span className="text-green-400">Free</span>
                            </div>
                            <div className="border-t border-white/10 pt-3 flex justify-between text-white font-bold text-lg">
                                <span>Total</span>
                                <span className="text-orange-400">₹{getTotal().toFixed(2)}</span>
                            </div>
                        </div>
                        <button onClick={() => navigate('/checkout')} className="btn-primary w-full py-3">
                            Proceed to Checkout →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
