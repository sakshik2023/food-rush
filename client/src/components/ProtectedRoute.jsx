import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading } = useAuth();

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!user) return <Navigate to={adminOnly ? '/admin/login' : '/login'} replace />;
    if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />;
    if (!adminOnly && user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;

    return children;
};

export default ProtectedRoute;
