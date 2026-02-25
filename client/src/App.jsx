import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';

// User Pages
import Login from './pages/user/Login';
import Register from './pages/user/Register';
import Home from './pages/user/Home';
import RestaurantMenu from './pages/user/RestaurantMenu';
import Cart from './pages/user/Cart';
import Checkout from './pages/user/Checkout';
import Orders from './pages/user/Orders';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import ManageRestaurants from './pages/admin/ManageRestaurants';
import ManageFoods from './pages/admin/ManageFoods';
import ManageOrders from './pages/admin/ManageOrders';
import ManageUsers from './pages/admin/ManageUsers';

const UserLayout = ({ children }) => (
  <div className="min-h-screen">
    <Navbar />
    <main>{children}</main>
  </div>
);

// Already logged-in user ko login/register se redirect karo
const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (user) return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/'} replace />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Toaster
            position="top-right"
            toastOptions={{
              style: { background: '#1a1d27', color: '#f0f0f0', border: '1px solid rgba(255,255,255,0.1)' },
            }}
          />
          <Routes>
            {/* Public auth routes — already logged-in user ko redirect karo */}
            <Route path="/login" element={<GuestRoute><UserLayout><Login /></UserLayout></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><UserLayout><Register /></UserLayout></GuestRoute>} />
            <Route path="/admin/login" element={<GuestRoute><AdminLogin /></GuestRoute>} />

            {/* User routes */}
            <Route path="/" element={<UserLayout><ProtectedRoute><Home /></ProtectedRoute></UserLayout>} />
            <Route path="/restaurant/:id" element={<UserLayout><ProtectedRoute><RestaurantMenu /></ProtectedRoute></UserLayout>} />
            <Route path="/cart" element={<UserLayout><ProtectedRoute><Cart /></ProtectedRoute></UserLayout>} />
            <Route path="/checkout" element={<UserLayout><ProtectedRoute><Checkout /></ProtectedRoute></UserLayout>} />
            <Route path="/orders" element={<UserLayout><ProtectedRoute><Orders /></ProtectedRoute></UserLayout>} />

            {/* Admin routes — all share the AdminLayout sidebar */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute adminOnly>
                <AdminLayout><Dashboard /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/restaurants" element={
              <ProtectedRoute adminOnly>
                <AdminLayout><ManageRestaurants /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/restaurants/:id/foods" element={
              <ProtectedRoute adminOnly>
                <AdminLayout><ManageFoods /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/orders" element={
              <ProtectedRoute adminOnly>
                <AdminLayout><ManageOrders /></AdminLayout>
              </ProtectedRoute>
            } />

            <Route path="/admin/users" element={
              <ProtectedRoute adminOnly>
                <AdminLayout><ManageUsers /></AdminLayout>
              </ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider >
  );
}

export default App;
