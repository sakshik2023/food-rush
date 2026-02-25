import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const FoodItemCard = ({ food }) => {
    const { cart, addToCart, removeFromCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Cart se actual quantity sync karo
    const cartItem = cart?.items?.find((i) => {
        const id = i.foodId?._id || i.foodId;
        return id?.toString() === food._id?.toString();
    });
    const qty = cartItem?.quantity || 0;

    const placeholder = `https://ui-avatars.com/api/?name=${encodeURIComponent(food.name)}&background=1a1d27&color=ff6b35&size=400`;

    const handleAdd = async () => {
        if (!user) {
            toast.error('Please login to add items to cart');
            navigate('/login');
            return;
        }
        setLoading(true);
        try {
            const isFirst = qty === 0;
            await addToCart(food._id, 1);
            if (isFirst) toast.success(`${food.name} added to cart!`);
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to add item');
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async () => {
        if (qty <= 0) return;
        setLoading(true);
        try {
            if (qty === 1) {
                await removeFromCart(food._id);
            } else {
                await addToCart(food._id, -1);
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to update cart');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card group flex flex-col">
            {/* Image */}
            <div className="relative overflow-hidden h-44">
                <img
                    src={food.image || placeholder}
                    alt={food.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { e.target.src = placeholder; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                {!food.isAvailable && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="badge badge-red text-sm">Unavailable</span>
                    </div>
                )}
                {food.category && (
                    <span className="absolute top-2 left-2 badge badge-orange">{food.category}</span>
                )}
            </div>

            {/* Info */}
            <div className="p-4 flex flex-col flex-1">
                <h4 className="font-semibold text-white mb-1 leading-snug">{food.name}</h4>
                <p className="text-orange-400 font-bold text-lg mt-auto mb-3">₹{food.price}</p>

                {/* Add / Quantity Controls */}
                {qty === 0 ? (
                    <button
                        onClick={handleAdd}
                        disabled={!food.isAvailable || loading}
                        className="btn-primary w-full text-sm"
                    >
                        {loading ? 'Adding...' : '+ Add to Cart'}
                    </button>
                ) : (
                    <div className="flex items-center justify-between rounded-xl overflow-hidden border border-orange-500/40"
                        style={{ background: 'rgba(255,107,53,0.08)' }}>
                        <button
                            onClick={handleRemove}
                            disabled={loading}
                            className="w-10 h-10 text-orange-400 font-bold text-xl hover:bg-orange-500/20 transition-colors flex items-center justify-center"
                        >
                            −
                        </button>
                        <span className="text-white font-bold text-base min-w-[2rem] text-center">
                            {qty}
                        </span>
                        <button
                            onClick={handleAdd}
                            disabled={loading}
                            className="w-10 h-10 text-orange-400 font-bold text-xl hover:bg-orange-500/20 transition-colors flex items-center justify-center"
                        >
                            +
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FoodItemCard;
