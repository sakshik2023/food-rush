import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRestaurants } from '../../services/api';
import RestaurantCard from '../../components/RestaurantCard';

const Home = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const restRes = await getRestaurants();
                setRestaurants(restRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const q = search.toLowerCase().trim();

    const filteredRestaurants = restaurants.filter((r) =>
        r.name.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q)
    );

    const isSearching = q.length > 0;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Hero */}
            <div className="text-center mb-12">
                <h1 className="text-5xl font-extrabold text-white mb-4 leading-tight">
                    Delicious Food,{' '}
                    <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                        Delivered Fast
                    </span>
                </h1>
                <p className="text-white/50 text-lg mb-8 max-w-xl mx-auto">
                    Browse restaurants and food items near you.
                </p>
                {/* Search */}
                <div className="max-w-md mx-auto w-full" style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 10, fontSize: '1rem' }}>🔍</span>
                    <input
                        id="home-search"
                        className="input-field w-full"
                        style={{ paddingLeft: '2.75rem' }}
                        placeholder="Search restaurants or food items..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', fontSize: '1.2rem', lineHeight: 1 }}
                        >×</button>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <>
                    {/* ── RESTAURANTS SECTION ── */}
                    {(!isSearching || filteredRestaurants.length > 0) && (
                        <section>
                            <h2 className="text-xl font-semibold text-white/70 mb-6">
                                🏪 {isSearching ? `${filteredRestaurants.length} Restaurant${filteredRestaurants.length !== 1 ? 's' : ''} Found` : `${filteredRestaurants.length} Restaurant${filteredRestaurants.length !== 1 ? 's' : ''} Available`}
                            </h2>
                            {filteredRestaurants.length === 0 ? (
                                <div className="text-center py-10 text-white/40">
                                    <div className="text-4xl mb-3">🏪</div>
                                    <p>No restaurants found</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filteredRestaurants.map((r) => (
                                        <RestaurantCard key={r._id} restaurant={r} />
                                    ))}
                                </div>
                            )}
                        </section>
                    )}

                    {/* Nothing found */}
                    {isSearching && filteredRestaurants.length === 0 && (
                        <div className="text-center py-20 text-white/40">
                            <div className="text-5xl mb-4">🔍</div>
                            <p className="text-xl">No results for "{search}"</p>
                            <p className="text-sm mt-2">Try searching for a restaurant name</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Home;
