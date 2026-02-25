/**
 * Seed Script — populates the database with:
 *   - 1 admin user  (admin@foodrush.com / admin123)
 *   - 8 sample restaurants
 *   - food items for each restaurant
 *
 * Usage:  node seed.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

// ── Models ────────────────────────────────────────────────────────────────────
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true, lowercase: true },
    password: String,
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });

const restaurantSchema = new mongoose.Schema({
    name: String, image: String, description: String,
    address: String, isActive: { type: Boolean, default: true },
}, { timestamps: true });

const foodSchema = new mongoose.Schema({
    restaurantId: mongoose.Schema.Types.ObjectId,
    name: String, image: String, price: Number,
    category: String, isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Restaurant = mongoose.model('Restaurant', restaurantSchema);
const FoodItem = mongoose.model('FoodItem', foodSchema);

// ── Data ─────────────────────────────────────────────────────────────────────
const restaurantsData = [
    {
        name: 'Burger Barn',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
        description: 'Juicy hand-crafted burgers made with 100% fresh beef patties.',
        address: '12 MG Road, Bengaluru',
        isActive: true,
        foods: [
            { name: 'Classic Smash Burger', price: 179, category: 'Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', isAvailable: true },
            { name: 'BBQ Bacon Burger', price: 229, category: 'Burger', image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400', isAvailable: true },
            { name: 'Veggie Delight Burger', price: 149, category: 'Burger', image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400', isAvailable: true },
            { name: 'Crispy Fries (Large)', price: 89, category: 'Sides', image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=400', isAvailable: true },
            { name: 'Chocolate Shake', price: 129, category: 'Beverages', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400', isAvailable: true },
        ],
    },
    {
        name: 'Pizza Palace',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
        description: 'Authentic stone-oven pizzas with fresh toppings and house-made sauce.',
        address: '45 Linking Road, Mumbai',
        isActive: true,
        foods: [
            { name: 'Margherita Classic', price: 249, category: 'Pizza', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', isAvailable: true },
            { name: 'Pepperoni Feast', price: 329, category: 'Pizza', image: 'https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?w=400', isAvailable: true },
            { name: 'BBQ Chicken Pizza', price: 349, category: 'Pizza', image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=400', isAvailable: true },
            { name: 'Garlic Bread', price: 99, category: 'Sides', image: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=400', isAvailable: true },
            { name: 'Tiramisu', price: 149, category: 'Desserts', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400', isAvailable: true },
        ],
    },
    {
        name: 'Spice Garden',
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
        description: 'Traditional Indian curries, biryanis, and kebabs cooked to perfection.',
        address: '7 Hazratganj, Lucknow',
        isActive: true,
        foods: [
            { name: 'Butter Chicken', price: 299, category: 'Curry', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400', isAvailable: true },
            { name: 'Paneer Tikka Masala', price: 279, category: 'Curry', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400', isAvailable: true },
            { name: 'Chicken Biryani', price: 349, category: 'Biryani', image: 'https://images.unsplash.com/photo-1630851840628-e7b2bf5f2236?w=400', isAvailable: true },
            { name: 'Dal Makhani', price: 199, category: 'Curry', image: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400', isAvailable: true },
            { name: 'Garlic Naan', price: 49, category: 'Breads', image: 'https://images.unsplash.com/photo-1536304447766-da0ed4ce1b73?w=400', isAvailable: true },
            { name: 'Gulab Jamun (2 pcs)', price: 79, category: 'Desserts', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', isAvailable: true },
        ],
    },
    {
        name: 'Sushi Street',
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
        description: 'Fresh, premium-quality sushi rolls and Japanese street food.',
        address: '22 Brigade Road, Bengaluru',
        isActive: true,
        foods: [
            { name: 'Salmon Nigiri (4 pcs)', price: 399, category: 'Nigiri', image: 'https://images.unsplash.com/photo-1617196034183-421b4040d45e?w=400', isAvailable: true },
            { name: 'Dragon Roll', price: 449, category: 'Rolls', image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400', isAvailable: true },
            { name: 'Spicy Tuna Roll', price: 379, category: 'Rolls', image: 'https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?w=400', isAvailable: true },
            { name: 'Edamame', price: 149, category: 'Starters', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', isAvailable: true },
            { name: 'Miso Soup', price: 99, category: 'Soups', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400', isAvailable: true },
        ],
    },
    {
        name: 'Taco Town',
        image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800',
        description: 'Authentic Mexican street tacos, burritos, and quesadillas bursting with flavor.',
        address: '34 Connaught Place, New Delhi',
        isActive: true,
        foods: [
            { name: 'Classic Street Tacos (3 pcs)', price: 199, category: 'Tacos', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400', isAvailable: true },
            { name: 'Chicken Burrito Bowl', price: 279, category: 'Bowls', image: 'https://images.unsplash.com/photo-1543352634-99a5d50ae78e?w=400', isAvailable: true },
            { name: 'Cheesy Quesadilla', price: 229, category: 'Quesadilla', image: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=400', isAvailable: true },
            { name: 'Loaded Nachos', price: 189, category: 'Sides', image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400', isAvailable: true },
            { name: 'Churros with Chocolate', price: 129, category: 'Desserts', image: 'https://images.unsplash.com/photo-1624371414361-e670edf87d11?w=400', isAvailable: true },
        ],
    },
    {
        name: 'The Dessert Lab',
        image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800',
        description: 'Artisanal cakes, waffles, ice creams, and shakes crafted with love.',
        address: '8 Koregaon Park, Pune',
        isActive: true,
        foods: [
            { name: 'Red Velvet Cake Slice', price: 189, category: 'Cakes', image: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=400', isAvailable: true },
            { name: 'Belgian Chocolate Waffle', price: 219, category: 'Waffles', image: 'https://images.unsplash.com/photo-1568051243858-533a607809a5?w=400', isAvailable: true },
            { name: 'Nutella Brownie Sundae', price: 249, category: 'Ice Cream', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400', isAvailable: true },
            { name: 'Mango Cheesecake', price: 229, category: 'Cakes', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400', isAvailable: true },
            { name: 'Oreo Thick Shake', price: 179, category: 'Shakes', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400', isAvailable: true },
            { name: 'Cotton Candy Ice Cream', price: 149, category: 'Ice Cream', image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400', isAvailable: true },
        ],
    },
    {
        name: 'Noodle House',
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
        description: 'Steaming bowls of ramen, stir-fried noodles and dim sum from across Asia.',
        address: '19 Salt Lake, Kolkata',
        isActive: true,
        foods: [
            { name: 'Tonkotsu Ramen', price: 329, category: 'Ramen', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', isAvailable: true },
            { name: 'Pad Thai Noodles', price: 279, category: 'Noodles', image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400', isAvailable: true },
            { name: 'Veg Hakka Noodles', price: 199, category: 'Noodles', image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400', isAvailable: true },
            { name: 'Steamed Dim Sum (6 pcs)', price: 239, category: 'Dim Sum', image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400', isAvailable: true },
            { name: 'Spring Rolls (4 pcs)', price: 149, category: 'Starters', image: 'https://images.unsplash.com/photo-1606525437657-7e7b4e4dc3d4?w=400', isAvailable: true },
            { name: 'Schezwan Fried Rice', price: 219, category: 'Rice', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', isAvailable: true },
        ],
    },
    {
        name: 'South Spice Kitchen',
        image: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=800',
        description: 'Authentic South Indian dosas, idlis, and filter coffee from Tamil Nadu.',
        address: '3 Nungambakkam, Chennai',
        isActive: true,
        foods: [
            { name: 'Masala Dosa', price: 129, category: 'Dosa', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400', isAvailable: true },
            { name: 'Ghee Roast Dosa', price: 149, category: 'Dosa', image: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=400', isAvailable: true },
            { name: 'Idli Sambar (4 pcs)', price: 99, category: 'Idli', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400', isAvailable: true },
            { name: 'Medu Vada (3 pcs)', price: 89, category: 'Vada', image: 'https://images.unsplash.com/photo-1601288496920-b6154fe3626a?w=400', isAvailable: true },
            { name: 'Chettinad Chicken Curry', price: 279, category: 'Curry', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400', isAvailable: true },
            { name: 'Filter Coffee', price: 59, category: 'Beverages', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400', isAvailable: true },
        ],
    },
];

// ── Main seed function ────────────────────────────────────────────────────────
async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Restaurant.deleteMany({});
        await FoodItem.deleteMany({});
        console.log('🗑  Cleared existing data');

        // Create admin user
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash('admin123', salt);
        await User.create({
            name: 'Super Admin',
            email: 'admin@gmail.com',
            password: hashed,
            role: 'admin',
        });
        console.log('👤 Admin created: admin@gmail.com / admin123');

        // Create restaurants + foods
        for (const { foods, ...restData } of restaurantsData) {
            const restaurant = await Restaurant.create(restData);
            const foodDocs = foods.map(f => ({ ...f, restaurantId: restaurant._id }));
            await FoodItem.insertMany(foodDocs);
            console.log(`🍽  Created "${restaurant.name}" with ${foods.length} food items`);
        }

        console.log('\n🎉 Seed complete! 8 restaurants added.');
        console.log('──────────────────────────────────────────');
        console.log('Admin login  →  http://localhost:5173/admin/login');
        console.log('Email:    admin@gmail.com');
        console.log('Password: admin123');
        console.log('──────────────────────────────────────────\n');

    } catch (err) {
        console.error('❌ Seed failed:', err.message);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

seed();
