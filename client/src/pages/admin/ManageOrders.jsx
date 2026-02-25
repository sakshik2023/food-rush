import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllOrders, updateOrderStatus } from '../../services/api';
import toast from 'react-hot-toast';

const statusOptions = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

const statusColorMap = {
    Pending: 'badge-orange',
    Preparing: 'badge-blue',
    'Out for Delivery': 'badge-blue',
    Delivered: 'badge-green',
    Cancelled: 'badge-red',
};

const selectColorMap = {
    Pending: { color: '#f97316', borderColor: '#f97316' },   // orange
    Preparing: { color: '#60a5fa', borderColor: '#60a5fa' },   // blue
    'Out for Delivery': { color: '#a78bfa', borderColor: '#a78bfa' },   // purple
    Delivered: { color: '#4ade80', borderColor: '#4ade80' },   // green
    Cancelled: { color: '#f87171', borderColor: '#f87171' },   // red
};

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    const fetchOrders = async () => {
        try {
            const { data } = await getAllOrders();
            setOrders(data);
        } catch {
            toast.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    const handleStatusChange = async (orderId, status) => {
        try {
            await updateOrderStatus(orderId, status);
            setOrders(orders.map(o => o._id === orderId ? { ...o, status } : o));
            toast.success('Order status updated');
        } catch {
            toast.error('Failed to update status');
        }
    };

    const filtered = filter === 'All' ? orders : orders.filter(o => o.status === filter);

    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">📋 Manage Orders</h1>
                    <p className="text-white/40 text-sm mt-1">View all customer orders and update status</p>
                </div>
                {/* Filter tabs */}
                <div className="flex gap-2 flex-wrap">
                    {['All', ...statusOptions].map((s) => (
                        <button key={s} onClick={() => setFilter(s)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filter === s ? 'bg-orange-500 text-white' : 'bg-white/10 text-white/60 hover:bg-white/15'}`}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-16 text-white/40">
                    <div className="text-4xl mb-3">📭</div>
                    <p>No orders found</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filtered.map((order) => (
                        <div key={order._id} className="card p-6">
                            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                <div>
                                    <p className="text-white/40 text-xs mb-0.5">Order ID: <span className="font-mono text-white/60">{order._id}</span></p>
                                    <p className="text-white font-semibold">
                                        {order.userId?.name || 'Unknown'}{' '}
                                        <span className="text-white/40 font-normal text-sm">({order.userId?.email})</span>
                                    </p>
                                    <p className="text-white/40 text-xs mt-1">
                                        {new Date(order.createdAt).toLocaleString('en-IN')}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`badge ${statusColorMap[order.status] || 'badge-gray'}`}>{order.status}</span>
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                        className="input-field py-1.5 text-sm font-semibold w-auto"
                                        style={{
                                            width: 'auto',
                                            ...(selectColorMap[order.status] || {}),
                                        }}
                                    >
                                        {statusOptions.map(s => (
                                            <option key={s} value={s} style={{ color: selectColorMap[s]?.color || '#fff', background: '#1a1d27' }}>
                                                {s}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-white/40 text-xs mb-2">Items</p>
                                    <div className="space-y-1">
                                        {order.items.map((item, i) => (
                                            <div key={i} className="flex justify-between text-sm">
                                                <span className="text-white/70">{item.name} × {item.quantity}</span>
                                                <span className="text-white">₹{(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="text-sm space-y-1">
                                    <p className="text-white/40 text-xs mb-2">Details</p>
                                    <p className="text-white/70">📍 {order.deliveryAddress}</p>
                                    <p className="text-white/70">💳 {order.paymentMethod}</p>
                                    <p className="text-orange-400 font-bold text-base">Total: ₹{order.totalAmount.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageOrders;
