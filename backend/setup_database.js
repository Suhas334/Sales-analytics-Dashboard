const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const createDatabase = async () => {
    // 1. Connect to default 'postgres' database to create the new database
    const client = new Client({
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: 'postgres', // Connect to default database first
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT || 5432,
    });

    try {
        await client.connect();
        console.log('Connected to default postgres database.');

        const dbName = process.env.DB_NAME || 'sales_dashboard';

        // Check if database exists
        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${dbName}'`);
        if (res.rowCount === 0) {
            console.log(`Creating database ${dbName}...`);
            await client.query(`CREATE DATABASE "${dbName}"`);
            console.log(`Database ${dbName} created successfully.`);
        } else {
            console.log(`Database ${dbName} already exists.`);
        }
    } catch (err) {
        console.error('Error creating database:', err);
    } finally {
        await client.end();
    }
};

const createTables = async () => {
    // 2. Connect to the actual application database to create tables
    const client = new Client({
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'sales_dashboard',
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT || 5432,
    });

    try {
        await client.connect();
        console.log(`Connected to ${process.env.DB_NAME} database.`);

        const schemaPath = path.join(__dirname, 'database', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        console.log('Running schema.sql...');
        await client.query(schema);
        console.log('Tables created successfully!');
    } catch (err) {
        console.error('Error creating tables:', err);
    } finally {
        await client.end();
    }
};

const runSetup = async () => {
    await createDatabase();
    await createTables();
};

runSetup();
