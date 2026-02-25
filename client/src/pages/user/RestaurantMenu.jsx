import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRestaurantById, getFoodsByRestaurant } from '../../services/api';
import FoodItemCard from '../../components/FoodItemCard';

const RestaurantMenu = () => {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('All');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [restRes, foodRes] = await Promise.all([
                    getRestaurantById(id),
                    getFoodsByRestaurant(id),
                ]);
                setRestaurant(restRes.data);
                setFoods(foodRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return (
        <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!restaurant) return (
        <div className="text-center py-20 text-white/40">Restaurant not found.</div>
    );

    const placeholder = `https://ui-avatars.com/api/?name=${encodeURIComponent(restaurant.name)}&background=ff6b35&color=fff&size=1200&bold=true`;
    const categories = ['All', ...new Set(foods.map((f) => f.category).filter(Boolean))];
    const filtered = category === 'All' ? foods : foods.filter((f) => f.category === category);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Restaurant banner */}
            <div className="relative h-56 rounded-2xl overflow-hidden mb-8">
                <img
                    src={restaurant.image || placeholder}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = placeholder; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
                <div className="absolute bottom-6 left-6">
                    <h1 className="text-3xl font-bold text-white mb-1">{restaurant.name}</h1>
                    <p className="text-white/70 text-sm">{restaurant.description}</p>
                    <p className="text-white/50 text-xs mt-1">📍 {restaurant.address}</p>
                </div>
                <div className="absolute top-4 right-4">
                    <span className={`badge ${restaurant.isActive ? 'badge-green' : 'badge-red'}`}>
                        {restaurant.isActive ? '● Open' : '● Closed'}
                    </span>
                </div>
            </div>

            {/* Category filter */}
            {categories.length > 1 && (
                <div className="flex gap-2 flex-wrap mb-6">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${category === cat
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-white/10 text-white/60 hover:bg-white/15'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            )}

            {/* Food items grid */}
            {filtered.length === 0 ? (
                <div className="text-center py-16 text-white/40">
                    <div className="text-4xl mb-3">🍽️</div>
                    <p>No items available</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filtered.map((food) => (
                        <FoodItemCard key={food._id} food={food} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default RestaurantMenu;
