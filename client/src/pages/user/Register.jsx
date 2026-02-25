import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../services/api';
import toast from 'react-hot-toast';

const Register = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        if (!/[A-Z]/.test(form.password)) {
            toast.error('Password must contain at least one uppercase letter');
            return;
        }
        if (!/[0-9]/.test(form.password)) {
            toast.error('Password must contain at least one number');
            return;
        }
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.password)) {
            toast.error('Password must contain at least one special character (!@#$%^&* etc.)');
            return;
        }
        setLoading(true);
        try {
            await registerUser({ ...form, role: 'user' });
            toast.success('Account created! Please login to continue.');
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'radial-gradient(ellipse at top, #1a0a00 0%, #0f1117 60%)' }}>
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="text-5xl mb-3">🍔</div>
                    <h1 className="text-3xl font-bold text-white">Create Account</h1>
                    <p className="text-white/50 mt-1">Join FoodRush and order your favorites</p>
                </div>
                <div className="card p-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Full Name</label>
                            <input
                                id="register-name"
                                className="input-field"
                                placeholder="Name"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Email Address</label>
                            <input
                                type="email"
                                id="register-email"
                                className="input-field"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Password</label>
                            <input
                                type="password"
                                id="register-password"
                                className="input-field"
                                placeholder="At least 6 characters"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                required
                            />
                            <ul className="mt-2 space-y-1 text-xs text-white/40">
                                <li className={form.password.length >= 6 ? 'text-green-400' : ''}>✓ At least 6 characters</li>
                                <li className={/[A-Z]/.test(form.password) ? 'text-green-400' : ''}>✓ One uppercase letter (A-Z)</li>
                                <li className={/[0-9]/.test(form.password) ? 'text-green-400' : ''}>✓ One number (0-9)</li>
                                <li className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.password) ? 'text-green-400' : ''}>✓ One special character (!@#$ etc.)</li>
                            </ul>
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>
                    <div className="border-t border-white/10 mt-6 pt-5 text-center">
                        <p className="text-white/50 text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="text-orange-400 hover:text-orange-300 font-semibold underline underline-offset-2">
                                Login here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
