require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { pool } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const salesRoutes = require('./routes/salesRoutes');

// Auto-create tables if they don't exist
const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'salesmanager',
                reset_password_token VARCHAR(255),
                reset_password_expire TIMESTAMP,
                last_login TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            -- Add last_login column if it was created without it
            ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;
            CREATE TABLE IF NOT EXISTS uploads (
                id SERIAL PRIMARY KEY,
                filename VARCHAR(255) NOT NULL,
                uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS sales (
                id SERIAL PRIMARY KEY,
                upload_id INTEGER REFERENCES uploads(id) ON DELETE CASCADE,
                date DATE NOT NULL,
                product VARCHAR(255) NOT NULL,
                category VARCHAR(255),
                region VARCHAR(255),
                quantity INTEGER NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                total_amount DECIMAL(10, 2) GENERATED ALWAYS AS (quantity * price) STORED,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Database tables ready');
    } catch (err) {
        console.error('Failed to initialize database tables:', err.message);
    }
};

const app = express();
const PORT = process.env.PORT || 5000;

// CORS — allow local dev and any Vercel deployment (preview + production)
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, Postman)
        if (!origin) return callback(null, true);

        const allowed =
            origin === 'http://localhost:5173' ||
            origin === 'http://localhost:3000' ||
            origin.endsWith('.vercel.app') ||          // all Vercel preview/prod URLs
            origin === process.env.FRONTEND_URL;       // custom domain if you set one

        if (allowed) return callback(null, true);
        callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sales', salesRoutes);

// Base route
app.get('/', (req, res) => {
    res.send('Sales Analytics API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await initDB();
});
