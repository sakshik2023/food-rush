import { createContext, useContext, useState, useEffect } from 'react';
import { getCart, addToCart as apiAddToCart, removeFromCart as apiRemoveFromCart, clearCart as apiClearCart } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState({ items: [] });
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        if (user && user.role === 'user') {
            fetchCart();
        } else {
            setCart({ items: [] });
            setCartCount(0);
        }
    }, [user]);

    useEffect(() => {
        const count = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        setCartCount(count);
    }, [cart]);

    const fetchCart = async () => {
        try {
            const { data } = await getCart();
            setCart(data);
        } catch (err) {
            setCart({ items: [] });
        }
    };

    const addToCart = async (foodId, quantity = 1) => {
        const { data } = await apiAddToCart({ foodId, quantity });
        setCart(data);
        return data;
    };

    const removeFromCart = async (foodId) => {
        const { data } = await apiRemoveFromCart(foodId);
        setCart(data);
    };

    const clearCart = async () => {
        await apiClearCart();
        setCart({ items: [] });
    };

    const getTotal = () => {
        return cart.items?.reduce((sum, item) => {
            const price = item.foodId?.price || 0;
            return sum + price * item.quantity;
        }, 0) || 0;
    };

    return (
        <CartContext.Provider value={{ cart, cartCount, fetchCart, addToCart, removeFromCart, clearCart, getTotal }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
