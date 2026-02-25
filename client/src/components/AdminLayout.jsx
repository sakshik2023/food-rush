import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
    { icon: '📊', label: 'Dashboard', path: '/admin/dashboard' },
    { icon: '🏪', label: 'Restaurants', path: '/admin/restaurants' },
    { icon: '📋', label: 'Orders', path: '/admin/orders' },
    { icon: '👥', label: 'Users', path: '/admin/users' },
];

const AdminLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => { logout(); navigate('/admin/login'); };

    return (
        <div className="min-h-screen flex" style={{ background: '#0f1117' }}>

            {/* ── Sidebar ── */}
            <aside className="w-64 flex-shrink-0 glass border-r border-white/10 p-6 hidden md:flex flex-col sticky top-0 h-screen overflow-y-auto">
                {/* Brand */}
                <div className="flex items-center gap-2 mb-10">
                    <span className="text-2xl">🍔</span>
                    <div>
                        <span className="text-lg font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                            FoodRush
                        </span>
                        <span className="ml-2 text-xs text-purple-400 font-semibold bg-purple-500/15 px-1.5 py-0.5 rounded-full">
                            Admin
                        </span>
                    </div>
                </div>

                {/* Nav */}
                <nav className="space-y-1 flex-1">
                    {navItems.map(({ icon, label, path }) => {
                        const active = location.pathname.startsWith(path) ||
                            (path === '/admin/restaurants' && location.pathname.includes('/admin/restaurants'));
                        return (
                            <Link
                                key={path}
                                to={path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${active
                                    ? 'bg-orange-500/15 text-orange-400 border border-orange-500/20'
                                    : 'text-white/60 hover:text-white hover:bg-white/8'
                                    }`}
                            >
                                <span className="text-lg">{icon}</span>
                                <span>{label}</span>
                                {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-400" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* User info */}
                <div className="border-t border-white/10 pt-5 mt-5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                            {user?.name?.[0]?.toUpperCase() || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">{user?.name}</p>
                            <p className="text-white/40 text-xs truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="btn-secondary text-sm w-full">
                        🚪 Logout
                    </button>
                </div>
            </aside>

            {/* ── Mobile top bar ── */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-40 glass border-b border-white/10 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span>🍔</span>
                    <span className="font-bold text-orange-400">FoodRush</span>
                    <span className="text-xs text-purple-400 font-semibold">Admin</span>
                </div>
                <div className="flex items-center gap-3">
                    {navItems.map(({ icon, path }) => (
                        <Link key={path} to={path}
                            className={`text-xl ${location.pathname.startsWith(path) ? 'opacity-100' : 'opacity-40'}`}>
                            {icon}
                        </Link>
                    ))}
                    <button onClick={handleLogout} className="text-white/60 hover:text-white text-sm ml-1">🚪</button>
                </div>
            </div>

            {/* ── Main content ── */}
            <main className="flex-1 overflow-y-auto md:p-8 p-4 pt-20 md:pt-8">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
