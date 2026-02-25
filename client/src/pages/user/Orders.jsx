import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getUserOrders } from '../../services/api';

// Order status pipeline (Cancelled is handled separately)
const STEPS = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered'];

const stepMeta = {
    Pending: { icon: '🕐', label: 'Order Placed', desc: 'Your order has been received' },
    Preparing: { icon: '👨‍🍳', label: 'Preparing', desc: 'The restaurant is cooking your food' },
    'Out for Delivery': { icon: '🛵', label: 'Out for Delivery', desc: 'Your order is on the way!' },
    Delivered: { icon: '✅', label: 'Delivered', desc: 'Enjoy your meal!' },
};

// ── Visual Stepper ──────────────────────────────────────────────────────────
const StatusTracker = ({ status }) => {
    if (status === 'Cancelled') {
        return (
            <div className="flex items-center gap-2 py-3 px-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <span className="text-2xl">❌</span>
                <div>
                    <p className="text-red-400 font-semibold text-sm">Order Cancelled</p>
                    <p className="text-white/40 text-xs">This order has been cancelled</p>
                </div>
            </div>
        );
    }

    const currentIdx = STEPS.indexOf(status);

    return (
        <div className="relative py-4">
            <div className="flex items-start justify-between relative">
                {/* Connector line behind steps */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/10" style={{ zIndex: 0 }} />
                <div
                    className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-orange-500 to-yellow-400 transition-all duration-700"
                    style={{ width: currentIdx === 0 ? '0%' : `${(currentIdx / (STEPS.length - 1)) * 100}%`, zIndex: 1 }}
                />

                {STEPS.map((step, idx) => {
                    const done = idx < currentIdx;
                    const active = idx === currentIdx;
                    const meta = stepMeta[step];

                    return (
                        <div key={step} className="flex flex-col items-center gap-2 flex-1" style={{ position: 'relative', zIndex: 2 }}>
                            {/* Circle */}
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all duration-500
                                ${done ? 'bg-orange-500 border-orange-500 shadow-lg shadow-orange-500/30'
                                    : active ? 'bg-orange-500/20 border-orange-500 animate-pulse'
                                        : 'bg-white/5 border-white/15'}`}
                            >
                                {done ? '✓' : meta.icon}
                            </div>

                            {/* Label */}
                            <div className="text-center px-1">
                                <p className={`text-xs font-semibold leading-tight ${active ? 'text-orange-400' : done ? 'text-white/80' : 'text-white/30'}`}>
                                    {meta.label}
                                </p>
                                {active && (
                                    <p className="text-white/40 text-xs mt-0.5 hidden sm:block">{meta.desc}</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// ── Main Page ───────────────────────────────────────────────────────────────
const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastRefreshed, setLastRefreshed] = useState(null);

    const fetchOrders = useCallback(async (silent = false) => {
        try {
            if (!silent) setLoading(true);
            const { data } = await getUserOrders();
            setOrders(data);
            setLastRefreshed(new Date());
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial fetch
    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    // Auto-refresh every 30 seconds for live status updates
    useEffect(() => {
        const interval = setInterval(() => fetchOrders(true), 30_000);
        return () => clearInterval(interval);
    }, [fetchOrders]);

    if (loading) return (
        <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
                <div>
                    <h1 className="text-3xl font-bold text-white">📦 My Orders</h1>
                    {lastRefreshed && (
                        <p className="text-white/30 text-xs mt-1">
                            Auto-refreshes every 30s · Last updated {lastRefreshed.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </p>
                    )}
                </div>
                <button
                    onClick={() => fetchOrders()}
                    className="btn-secondary text-sm flex items-center gap-2"
                >
                    🔄 Refresh
                </button>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-16 text-white/40">
                    <div className="text-5xl mb-4">📭</div>
                    <p className="text-xl">No orders yet</p>
                    <p className="text-sm mt-2 mb-6">Place your first order to track it here</p>
                    <Link to="/" className="btn-primary text-sm">Browse Restaurants</Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order._id} className="card p-6">
                            {/* Top row: ID + date */}
                            <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                                <div>
                                    <p className="text-white/40 text-xs mb-0.5">Order ID</p>
                                    <p className="text-white/80 font-mono text-xs">{order._id}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-white/40 text-xs">
                                        {new Date(order.createdAt).toLocaleString('en-IN', {
                                            day: 'numeric', month: 'short', year: 'numeric',
                                            hour: '2-digit', minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                            </div>

                            {/* ── ORDER TRACKING STEPPER ── */}
                            <StatusTracker status={order.status} />

                            {/* Divider */}
                            <div className="border-t border-white/8 my-5" />

                            {/* Items */}
                            <div className="space-y-1.5 mb-5">
                                <p className="text-white/40 text-xs mb-2">Items Ordered</p>
                                {order.items.map((item, i) => (
                                    <div key={i} className="flex justify-between text-sm">
                                        <span className="text-white/70 flex items-center gap-1.5">
                                            {item.image && (
                                                <img src={item.image} alt="" className="w-6 h-6 rounded object-cover" onError={e => e.target.style.display = 'none'} />
                                            )}
                                            {item.name}
                                            <span className="text-white/40">× {item.quantity}</span>
                                        </span>
                                        <span className="text-white">₹{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Footer: address + payment + total */}
                            <div className="rounded-xl bg-white/4 border border-white/8 px-4 py-3 flex flex-wrap gap-4 justify-between text-sm">
                                <span className="text-white/50">📍 {order.deliveryAddress}</span>
                                <div className="flex items-center gap-4">
                                    <span className="text-white/50">
                                        {order.paymentMethod === 'COD' ? '💵 Cash on Delivery' : '💳 Online'}
                                    </span>
                                    <span className="text-orange-400 font-bold text-base">₹{order.totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
