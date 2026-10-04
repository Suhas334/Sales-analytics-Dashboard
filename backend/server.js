require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const salesRoutes = require('./routes/salesRoutes');

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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
