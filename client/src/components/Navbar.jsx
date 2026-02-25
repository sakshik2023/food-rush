import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 glass border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 text-xl font-bold">
                    <span className="text-2xl">🍔</span>
                    <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                        FoodRush
                    </span>
                </Link>

                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <span className="text-sm text-white/60 hidden sm:block">
                                Hi, <span className="text-white font-medium">{user.name}</span>
                            </span>
                            <Link to="/orders" className="text-white/70 hover:text-white text-sm transition-colors">
                                My Orders
                            </Link>
                            <Link to="/cart" className="relative text-white/70 hover:text-white transition-colors">
                                <span className="text-xl">🛒</span>
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                            <button onClick={handleLogout} className="btn-secondary text-sm">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn-secondary text-sm">Login</Link>
                            <Link to="/register" className="btn-primary text-sm">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
