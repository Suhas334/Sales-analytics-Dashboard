const db = require('./config/db');

const migrate = async () => {
    try {
        console.log('Starting migration...');

        // 1. Create uploads table
        await db.query(`
            CREATE TABLE IF NOT EXISTS uploads (
                id SERIAL PRIMARY KEY,
                filename VARCHAR(255) NOT NULL,
                uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Created uploads table.');

        // 2. Add upload_id to sales table if it doesn't exist
        // We use a check to avoid errors if run multiple times
        await db.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='sales' AND column_name='upload_id') THEN 
                    ALTER TABLE sales ADD COLUMN upload_id INTEGER REFERENCES uploads(id) ON DELETE CASCADE; 
                END IF; 
            END $$;
        `);
        console.log('Added upload_id to sales table.');

        console.log('Migration completed successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
};

migrate();
