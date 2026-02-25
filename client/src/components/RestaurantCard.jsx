import { Link } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
    const placeholder = `https://ui-avatars.com/api/?name=${encodeURIComponent(restaurant.name)}&background=ff6b35&color=fff&size=400&bold=true`;

    return (
        <div className="card group cursor-pointer">
            <div className="relative overflow-hidden h-48">
                <img
                    src={restaurant.image || placeholder}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { e.target.src = placeholder; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-3 right-3">
                    <span className={`badge ${restaurant.isActive ? 'badge-green' : 'badge-red'}`}>
                        {restaurant.isActive ? '● Open' : '● Closed'}
                    </span>
                </div>
            </div>
            <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-1">{restaurant.name}</h3>
                <p className="text-white/50 text-sm mb-1 line-clamp-2">{restaurant.description}</p>
                <p className="text-white/40 text-xs mb-4">📍 {restaurant.address}</p>
                <Link
                    to={`/restaurant/${restaurant._id}`}
                    className="btn-primary w-full block text-center text-sm"
                >
                    View Menu →
                </Link>
            </div>
        </div>
    );
};

export default RestaurantCard;
