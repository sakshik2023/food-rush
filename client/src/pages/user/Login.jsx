import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await loginUser(form);
            login(data, data.token);
            toast.success('Welcome back!');
            if (data.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'radial-gradient(ellipse at top, #1a0a00 0%, #0f1117 60%)' }}>
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="text-5xl mb-3">🍔</div>
                    <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
                    <p className="text-white/50 mt-1">Sign in to your FoodRush account</p>
                </div>
                <div className="card p-8">
                    <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Email Address</label>
                            <input
                                type="email"
                                id="login-email"
                                className="input-field"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                autoComplete="email"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Password</label>
                            <input
                                type="password"
                                id="login-password"
                                className="input-field"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                autoComplete="current-password"
                                required
                            />
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base mt-2">
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                    <p className="text-center text-white/50 text-sm mt-6">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-orange-400 hover:text-orange-300 font-medium">Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
