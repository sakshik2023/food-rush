import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { placeOrder } from '../../services/api';
import toast from 'react-hot-toast';

const Checkout = () => {
    const { cart, getTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [form, setForm] = useState({ deliveryAddress: '', paymentMethod: 'COD' });
    const [loading, setLoading] = useState(false);

    const items = cart?.items || [];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (items.length === 0) {
            toast.error('Your cart is empty');
            return;
        }
        setLoading(true);
        try {
            await placeOrder(form);
            await clearCart();
            toast.success('Order placed successfully! 🎉');
            navigate('/orders');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-white mb-8">🏠 Checkout</h1>
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Form */}
                <div className="flex-1">
                    <form onSubmit={handleSubmit} className="card p-6 space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-4">Delivery Details</h2>
                            <label className="block text-sm font-medium text-white/70 mb-2">Delivery Address</label>
                            <textarea
                                id="checkout-address"
                                className="input-field resize-none"
                                rows={3}
                                placeholder="Enter your full delivery address..."
                                value={form.deliveryAddress}
                                onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-4">Payment Method</h2>
                            <div className="grid grid-cols-2 gap-3">
                                {['COD', 'Online'].map((method) => (
                                    <button
                                        key={method}
                                        type="button"
                                        onClick={() => setForm({ ...form, paymentMethod: method })}
                                        className={`p-4 rounded-xl border-2 transition-all text-left ${form.paymentMethod === method
                                                ? 'border-orange-500 bg-orange-500/10 text-white'
                                                : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20'
                                            }`}
                                    >
                                        <div className="text-2xl mb-1">{method === 'COD' ? '💵' : '💳'}</div>
                                        <div className="font-semibold">{method === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</div>
                                        <div className="text-xs mt-0.5">{method === 'COD' ? 'Pay when delivered' : 'Mock payment'}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
                            {loading ? 'Placing Order...' : `Place Order • ₹${getTotal().toFixed(2)}`}
                        </button>
                    </form>
                </div>

                {/* Order summary */}
                <div className="lg:w-72">
                    <div className="card p-5">
                        <h3 className="font-bold text-white mb-4">Order Summary</h3>
                        <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
                            {items.map((item) => {
                                const food = item.foodId;
                                if (!food) return null;
                                return (
                                    <div key={food._id} className="flex justify-between text-sm">
                                        <span className="text-white/70">{food.name} × {item.quantity}</span>
                                        <span className="text-white">₹{(food.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="border-t border-white/10 pt-3 flex justify-between font-bold">
                            <span className="text-white">Total</span>
                            <span className="text-orange-400 text-lg">₹{getTotal().toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
