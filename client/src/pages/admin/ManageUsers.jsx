import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const ManageUsers = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/admin/users');
            setUsers(data);
        } catch {
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const toggleRole = async (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        setUpdating(userId);
        try {
            await api.patch(`/admin/users/${userId}/role`, { role: newRole });
            setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
            toast.success(`User role changed to ${newRole}`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update role');
        } finally {
            setUpdating(null);
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">👥 Manage Users</h1>
                <p className="text-white/40 text-sm mt-1">
                    Promote users to admin or demote admins to regular users
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-white/5 text-white/40 text-left">
                                    <th className="px-5 py-3 font-medium">User</th>
                                    <th className="px-5 py-3 font-medium">Email</th>
                                    <th className="px-5 py-3 font-medium">Role</th>
                                    <th className="px-5 py-3 font-medium text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {users.map(u => {
                                    const isSelf = u._id === currentUser?._id;
                                    const isAdmin = u.role === 'admin';
                                    return (
                                        <tr key={u._id} className="hover:bg-white/3 transition-colors">
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white ${isAdmin ? 'bg-gradient-to-br from-purple-500 to-indigo-600' : 'bg-gradient-to-br from-orange-500 to-yellow-500'}`}>
                                                        {u.name?.[0]?.toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-medium">{u.name}</p>
                                                        {isSelf && <span className="text-white/30 text-xs">(you)</span>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3 text-white/60">{u.email}</td>
                                            <td className="px-5 py-3">
                                                <span className={`badge ${isAdmin ? 'badge-blue' : 'badge-green'}`}>
                                                    {isAdmin ? '👨‍💼 Admin' : '👤 User'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-right">
                                                {isSelf ? (
                                                    <span className="text-white/20 text-xs">Cannot change own role</span>
                                                ) : (
                                                    <button
                                                        disabled={updating === u._id}
                                                        onClick={() => toggleRole(u._id, u.role)}
                                                        className={isAdmin ? 'btn-secondary text-xs px-4 py-1.5' : 'btn-primary text-xs px-4 py-1.5'}
                                                    >
                                                        {updating === u._id
                                                            ? 'Updating...'
                                                            : isAdmin ? 'Remove Admin' : '⬆ Make Admin'}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;
