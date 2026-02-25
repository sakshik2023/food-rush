import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRestaurants, getAllOrders } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({ icon, label, value, color, sub }) => (
    <div className="card p-5 flex items-center gap-4">
        <div className={`text-3xl w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-white/50 text-xs">{label}</p>
            <p className="text-white text-2xl font-bold">{value}</p>
            {sub && <p className="text-white/30 text-xs mt-0.5">{sub}</p>}
        </div>
    </div>
);

const QuickLink = ({ icon, title, desc, to, accent }) => (
    <Link to={to}
        className={`card p-6 block hover:border-${accent}-500/40 transition-colors group`}>
        <div className="text-3xl mb-3">{icon}</div>
        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-orange-300 transition-colors">{title}</h3>
        <p className="text-white/40 text-sm">{desc}</p>
        <span className="inline-block mt-3 text-xs text-orange-400 font-medium">Open →</span>
    </Link>
);

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ restaurants: 0, orders: 0, pending: 0, revenue: 0, delivered: 0 });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [restRes, ordersRes] = await Promise.all([getRestaurants(), getAllOrders()]);
                const orders = ordersRes.data;
                const delivered = orders.filter(o => o.status === 'Delivered');
                const revenue = delivered.reduce((s, o) => s + o.totalAmount, 0);
                setStats({
                    restaurants: restRes.data.length,
                    orders: orders.length,
                    pending: orders.filter(o => o.status === 'Pending').length,
                    revenue,
                    delivered: delivered.length,
                });
                setRecentOrders(orders.slice(0, 5));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statusColor = {
        Pending: 'badge-orange', Preparing: 'badge-blue',
        'Out for Delivery': 'badge-blue', Delivered: 'badge-green', Cancelled: 'badge-red',
    };

    return (
        <div>
            {/* Welcome */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">
                    👋 Welcome back, <span className="text-orange-400">{user?.name}</span>
                </h1>
                <p className="text-white/40 text-sm mt-1">Here's an overview of your FoodRush platform</p>
            </div>

            {/* Stat cards */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                        <StatCard icon="🏪" label="Restaurants" value={stats.restaurants} color="bg-orange-500/15" sub="Active on platform" />
                        <StatCard icon="📦" label="Total Orders" value={stats.orders} color="bg-blue-500/15" sub="All time" />
                        <StatCard icon="⏳" label="Pending Orders" value={stats.pending} color="bg-yellow-500/15" sub="Awaiting action" />
                        <StatCard icon="💰" label="Revenue" value={`₹${stats.revenue.toLocaleString('en-IN')}`} color="bg-green-500/15" sub={`${stats.delivered} delivered`} />
                    </div>

                    {/* Quick actions */}
                    <h2 className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                        <QuickLink icon="🏪" title="Manage Restaurants" desc="Add, edit, or remove restaurants and manage their details." to="/admin/restaurants" accent="orange" />
                        <QuickLink icon="🍽️" title="Manage Food Items" desc="Browse restaurants and manage their food menus and pricing." to="/admin/restaurants" accent="yellow" />
                        <QuickLink icon="📋" title="Manage Orders" desc="View all customer orders and update delivery status." to="/admin/orders" accent="purple" />
                    </div>

                    {/* Recent orders table */}
                    {recentOrders.length > 0 && (
                        <>
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-white/60 text-xs font-semibold uppercase tracking-wider">Recent Orders</h2>
                                <Link to="/admin/orders" className="text-orange-400 text-xs hover:underline">View all →</Link>
                            </div>
                            <div className="card overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-white/5 text-white/40 text-left">
                                                <th className="px-4 py-3 font-medium">Customer</th>
                                                <th className="px-4 py-3 font-medium">Items</th>
                                                <th className="px-4 py-3 font-medium">Total</th>
                                                <th className="px-4 py-3 font-medium">Status</th>
                                                <th className="px-4 py-3 font-medium">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {recentOrders.map(order => (
                                                <tr key={order._id} className="hover:bg-white/3 transition-colors">
                                                    <td className="px-4 py-3 text-white font-medium">
                                                        {order.userId?.name || 'Unknown'}
                                                        <span className="block text-white/40 text-xs font-normal">{order.userId?.email}</span>
                                                    </td>
                                                    <td className="px-4 py-3 text-white/60">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</td>
                                                    <td className="px-4 py-3 text-orange-400 font-bold">₹{order.totalAmount.toFixed(0)}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`badge ${statusColor[order.status] || 'badge-gray'}`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-white/40 text-xs">
                                                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default Dashboard;
