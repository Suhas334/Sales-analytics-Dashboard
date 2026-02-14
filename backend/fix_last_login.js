const { Client } = require('pg');
require('dotenv').config();

const fixDatabase = async () => {
    const client = new Client({
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'sales_dashboard',
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT || 5432,
    });

    try {
        await client.connect();
        console.log(`Connected to database.`);

        console.log('Adding last_login column...');
        await client.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;');
        console.log('Column added successfully.');

    } catch (err) {
        console.error('Error updating database:', err);
    } finally {
        await client.end();
    }
};

fixDatabase();
