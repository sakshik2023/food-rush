import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    getRestaurants,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
} from '../../services/api';
import toast from 'react-hot-toast';

const emptyForm = { name: '', description: '', address: '', image: '', isActive: true };

// ── Confirm Modal ─────────────────────────────────────────────────────────────
const ConfirmModal = ({ message, onConfirm, onCancel }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
        <div className="card p-6 w-full max-w-sm text-center">
            <div className="text-3xl mb-3">🗑️</div>
            <p className="text-white font-semibold mb-1">Confirm Delete</p>
            <p className="text-white/50 text-sm mb-6">{message}</p>
            <div className="flex gap-3">
                <button onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
                <button onClick={onConfirm} className="btn-danger flex-1">Yes, Delete</button>
            </div>
        </div>
    </div>
);

const ManageRestaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(null); // holds restaurant id to delete

    const fetchAll = async () => {
        try {
            const { data } = await getRestaurants();
            setRestaurants(data);
        } catch (err) {
            toast.error('Failed to fetch restaurants');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAll(); }, []);

    const openAdd = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
    const openEdit = (r) => { setEditing(r._id); setForm({ name: r.name, description: r.description || '', address: r.address, image: r.image || '', isActive: r.isActive }); setShowForm(true); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = { ...form };
            if (editing) {
                await updateRestaurant(editing, payload);
                toast.success('Restaurant updated!');
            } else {
                await createRestaurant(payload);
                toast.success('Restaurant added!');
            }
            setShowForm(false);
            fetchAll();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirmDelete) return;
        try {
            await deleteRestaurant(confirmDelete);
            toast.success('Restaurant deleted');
            setConfirmDelete(null);
            fetchAll();
        } catch (err) {
            toast.error('Failed to delete');
        }
    };

    return (
        <div>
            {/* Confirm modal */}
            {confirmDelete && (
                <ConfirmModal
                    message="Are you sure you want to delete this restaurant? This cannot be undone."
                    onConfirm={handleDelete}
                    onCancel={() => setConfirmDelete(null)}
                />
            )}

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">🏪 Manage Restaurants</h1>
                    <p className="text-white/40 text-sm mt-1">Add, edit, or remove restaurants</p>
                </div>
                <button onClick={openAdd} className="btn-primary">+ Add Restaurant</button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
                    <div className="card p-8 w-full max-w-lg">
                        <h2 className="text-xl font-bold text-white mb-6">{editing ? 'Edit Restaurant' : 'Add Restaurant'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input id="rest-name" className="input-field" placeholder="Restaurant Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                            <input id="rest-desc" className="input-field" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                            <input id="rest-address" className="input-field" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
                            <input id="rest-image" className="input-field" placeholder="Image URL (Cloudinary or direct link)" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 accent-orange-500" />
                                <span className="text-white/70 text-sm">Active (visible to customers)</span>
                            </label>
                            <div className="flex gap-3">
                                <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : 'Save'}</button>
                                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* List */}
            {loading ? (
                <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>
            ) : restaurants.length === 0 ? (
                <div className="text-center py-20 text-white/30">
                    <div className="text-5xl mb-3">🏪</div>
                    <p>No restaurants yet. Click "+ Add Restaurant" to get started.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {restaurants.map((r) => (
                        <div key={r._id} className="card overflow-hidden">
                            <img
                                src={r.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.name)}&background=ff6b35&color=fff&size=400`}
                                alt={r.name}
                                className="w-full h-36 object-cover"
                                onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(r.name)}&background=ff6b35&color=fff`; }}
                            />
                            <div className="p-4">
                                <div className="flex items-start justify-between mb-1">
                                    <h3 className="font-bold text-white">{r.name}</h3>
                                    <span className={`badge ${r.isActive ? 'badge-green' : 'badge-red'}`}>{r.isActive ? 'Active' : 'Inactive'}</span>
                                </div>
                                <p className="text-white/50 text-xs mb-1">{r.description}</p>
                                <p className="text-white/40 text-xs mb-3">📍 {r.address}</p>
                                <div className="flex gap-2">
                                    <Link to={`/admin/restaurants/${r._id}/foods`} className="btn-secondary flex-1 text-xs text-center py-2">🍽 Foods</Link>
                                    <button onClick={() => openEdit(r)} className="btn-secondary text-xs px-3 py-2">✏️</button>
                                    <button onClick={() => setConfirmDelete(r._id)} className="btn-danger text-xs px-3 py-2">🗑</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageRestaurants;
