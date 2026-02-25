import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const AdminLogin = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await loginUser(form);
            if (data.role !== 'admin') {
                toast.error('Access denied. Admin only.');
                return;
            }
            login(data, data.token);
            toast.success('Welcome, Admin!');
            navigate('/admin/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'radial-gradient(ellipse at top, #0a001a 0%, #0f1117 60%)' }}>
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="text-5xl mb-3">👨‍💼</div>
                    <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
                    <p className="text-white/50 mt-1">Sign in to manage FoodRush</p>
                </div>
                <div className="card p-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Admin Email</label>
                            <input
                                type="email"
                                id="admin-email"
                                className="input-field"
                                placeholder="admin@foodrush.com"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Password</label>
                            <input
                                type="password"
                                id="admin-password"
                                className="input-field"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                required
                            />
                        </div>
                        <button type="submit" disabled={loading} className="w-full py-3 font-bold text-white rounded-xl text-base transition-all"
                            style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
                            {loading ? 'Signing in...' : 'Sign In as Admin'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
