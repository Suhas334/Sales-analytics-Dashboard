const { Client } = require('pg');
require('dotenv').config();

const setupDownloads = async () => {
    const client = new Client({
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'sales_dashboard',
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT || 5432,
    });

    try {
        await client.connect();
        console.log('Connected to database.');

        // Create downloads table
        await client.query(`
            CREATE TABLE IF NOT EXISTS downloads (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Downloads table created/verified.');

    } catch (err) {
        console.error('Error setting up database:', err);
    } finally {
        await client.end();
    }
};

setupDownloads();
