/**
 * seedAdmin.js
 * -----------
 * Run this script to create an admin user in the database.
 * Password is automatically hashed via the User model's pre-save hook (bcryptjs).
 *
 * Usage:
 *   node seedAdmin.js
 *   node seedAdmin.js --email admin@food.com --password MySecret123
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

// ──────────────────────────────────────────────
//  Default credentials (override via CLI args)
// ──────────────────────────────────────────────
const args = process.argv.slice(2);

const getArg = (flag) => {
    const idx = args.indexOf(flag);
    return idx !== -1 ? args[idx + 1] : null;
};

const ADMIN_NAME = getArg('--name') || 'Super Admin';
const ADMIN_EMAIL = getArg('--email') || 'admin@gmail.com';
const ADMIN_PASSWORD = getArg('--password') || 'admin123';

// ──────────────────────────────────────────────
//  Main seeder
// ──────────────────────────────────────────────
const seedAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅  MongoDB connected');

        // Check if admin already exists
        const existing = await User.findOne({ email: ADMIN_EMAIL });

        if (existing) {
            console.log(`⚠️   Admin with email "${ADMIN_EMAIL}" already exists in the database.`);
            console.log('     No changes made. Delete the existing user first if you want to reseed.');
            process.exit(0);
        }

        // Create admin — password gets bcrypt-hashed via User model pre-save hook
        const admin = await User.create({
            name: ADMIN_NAME,
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            role: 'admin',
        });

        console.log('\n🎉  Admin user created successfully!');
        console.log('─────────────────────────────────');
        console.log(`   Name     : ${admin.name}`);
        console.log(`   Email    : ${admin.email}`);
        console.log(`   Password : ${ADMIN_PASSWORD}   (stored as bcrypt hash in DB)`);
        console.log(`   Role     : ${admin.role}`);
        console.log('─────────────────────────────────\n');

        process.exit(0);
    } catch (err) {
        console.error('❌  Error seeding admin:', err.message);
        process.exit(1);
    }
};

seedAdmin();
