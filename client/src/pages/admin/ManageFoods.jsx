import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    getRestaurantById,
    getFoodsByRestaurant,
    createFoodItem,
    updateFoodItem,
    deleteFoodItem,
} from '../../services/api';
import toast from 'react-hot-toast';

const emptyForm = { name: '', category: '', price: '', image: '', isAvailable: true };

// ── Confirm Modal ────────────────────────────────────────────────────────────
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

const ManageFoods = () => {
    const { id: restaurantId } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(null);

    const fetchAll = async () => {
        try {
            const [restRes, foodRes] = await Promise.all([
                getRestaurantById(restaurantId),
                getFoodsByRestaurant(restaurantId),
            ]);
            setRestaurant(restRes.data);
            setFoods(foodRes.data);
        } catch (err) {
            toast.error('Failed to load');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAll(); }, [restaurantId]);

    const openAdd = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
    const openEdit = (f) => {
        setEditing(f._id);
        setForm({ name: f.name, category: f.category || '', price: f.price, image: f.image || '', isAvailable: f.isAvailable });
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = { ...form, price: Number(form.price) };
            if (editing) {
                await updateFoodItem(editing, payload);
                toast.success('Food item updated!');
            } else {
                await createFoodItem(restaurantId, payload);
                toast.success('Food item added!');
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
            await deleteFoodItem(confirmDelete);
            toast.success('Food item removed');
            setConfirmDelete(null);
            fetchAll();
        } catch {
            toast.error('Failed to delete');
        }
    };

    return (
        <div>
            {/* Confirm modal */}
            {confirmDelete && (
                <ConfirmModal
                    message="Are you sure you want to delete this food item?"
                    onConfirm={handleDelete}
                    onCancel={() => setConfirmDelete(null)}
                />
            )}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <Link to="/admin/restaurants" className="text-white/50 hover:text-white text-sm mb-1 inline-flex items-center gap-1">
                        ← Back to Restaurants
                    </Link>
                    <h1 className="text-2xl font-bold text-white">🍽️ {restaurant?.name} – Food Items</h1>
                    <p className="text-white/40 text-sm mt-1">Manage menu items for this restaurant</p>
                </div>
                <button onClick={openAdd} className="btn-primary">+ Add Food Item</button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
                    <div className="card p-8 w-full max-w-lg">
                        <h2 className="text-xl font-bold text-white mb-6">{editing ? 'Edit Food Item' : 'Add Food Item'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input id="food-name" className="input-field" placeholder="Food Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                            <input id="food-category" className="input-field" placeholder="Category (e.g. Pizza, Burger)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                            <input id="food-price" type="number" min="0" className="input-field" placeholder="Price (₹)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                            <input id="food-image" className="input-field" placeholder="Image URL (optional)" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })} className="w-4 h-4 accent-orange-500" />
                                <span className="text-white/70 text-sm">Available for ordering</span>
                            </label>
                            <div className="flex gap-3">
                                <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : 'Save'}</button>
                                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>
            ) : foods.length === 0 ? (
                <div className="text-center py-16 text-white/40">
                    <div className="text-4xl mb-3">🍕</div>
                    <p>No food items yet. Add your first one!</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-2xl border border-white/10">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-white/5 text-white/50">
                                <th className="text-left px-4 py-3">Item</th>
                                <th className="text-left px-4 py-3">Category</th>
                                <th className="text-left px-4 py-3">Price</th>
                                <th className="text-left px-4 py-3">Status</th>
                                <th className="text-right px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {foods.map((food) => (
                                <tr key={food._id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={food.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(food.name)}&background=1a1d27&color=ff6b35&size=40`}
                                                className="w-10 h-10 rounded-lg object-cover"
                                                onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(food.name)}&background=1a1d27&color=ff6b35`; }}
                                                alt=""
                                            />
                                            <span className="text-white font-medium">{food.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-white/60">{food.category || '—'}</td>
                                    <td className="px-4 py-3 text-orange-400 font-bold">₹{food.price}</td>
                                    <td className="px-4 py-3">
                                        <span className={`badge ${food.isAvailable ? 'badge-green' : 'badge-red'}`}>
                                            {food.isAvailable ? 'Available' : 'Unavailable'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex gap-2 justify-end">
                                            <button onClick={() => openEdit(food)} className="btn-secondary text-xs px-3 py-1.5">Edit</button>
                                            <button onClick={() => setConfirmDelete(food._id)} className="btn-danger text-xs px-3 py-1.5">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ManageFoods;
