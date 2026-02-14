const db = require('../config/db');
const fs = require('fs');
const csv = require('csv-parser');

const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) return date;

    // Handle DD/MM/YYYY or DD-MM-YYYY format
    const parts = dateStr.match(/(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
    if (parts) {
        return new Date(`${parts[3]}-${parts[2]}-${parts[1]}`);
    }
    return null;
};

const uploadSales = (req, res) => {
    console.log('Upload Request Received');
    console.log('Headers:', req.headers['content-type']);
    if (req.file) {
        console.log('File:', req.file.originalname, req.file.path);
    } else {
        console.error('No file in request');
    }

    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const results = [];
    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('error', (err) => {
            console.error('CSV parse error', err);
            try { fs.unlinkSync(req.file.path); } catch (e) { /* ignore */ }
            if (!res.headersSent) return res.status(500).json({ message: 'Error parsing CSV' });
        })
        .on('end', async () => {
            let client;
            try {
                client = await db.pool.connect();
                await client.query('BEGIN');

                // Create Upload Record
                const uploadRes = await client.query(
                    'INSERT INTO uploads (filename) VALUES ($1) RETURNING id',
                    [req.file.originalname]
                );
                const uploadId = uploadRes.rows[0].id;

                let inserted = 0;

                // Parse mapping if provided (it comes as a stringified JSON in multipart/form-data)
                let mapping = null;
                console.log('--- Upload Debug ---');
                console.log('Req Body:', req.body);
                if (req.body.mapping) {
                    try {
                        mapping = JSON.parse(req.body.mapping);
                        console.log('Parsed Mapping:', mapping);
                    } catch (e) {
                        console.error('Error parsing mapping JSON', e);
                    }
                }

                for (const row of results) {
                    let dateStr, product, category, region, quantity, price;

                    if (mapping) {
                        // Use user-provided mapping
                        dateStr = row[mapping.date];
                        product = row[mapping.product]?.trim();
                        category = row[mapping.category]?.trim();
                        region = row[mapping.region]?.trim();
                        quantity = row[mapping.quantity];
                        price = row[mapping.price];

                        // Debug first row
                        if (inserted === 0) {
                            console.log('Debug First Row Mapping:');
                            console.log('Row:', row);
                            console.log('Mapped - Date:', dateStr, 'Product:', product);
                        }
                    } else {
                        // Fallback: Normalize keys to lowercase
                        const normalizedRow = {};
                        Object.keys(row).forEach(key => {
                            normalizedRow[key.toLowerCase().trim()] = row[key];
                        });

                        dateStr = normalizedRow['date'];
                        product = normalizedRow['product']?.trim();
                        category = normalizedRow['category']?.trim();
                        region = normalizedRow['region']?.trim();
                        quantity = normalizedRow['quantity'];
                        price = normalizedRow['price'];
                    }

                    if (!dateStr || !product || !quantity || !price) continue;

                    const date = parseDate(dateStr);
                    if (!date) continue;

                    const qty = parseInt(quantity, 10);
                    const prc = parseFloat(price);

                    if (Number.isNaN(qty) || Number.isNaN(prc)) continue;

                    const insertRes = await client.query(
                        'INSERT INTO sales (upload_id, date, product, category, region, quantity, price) VALUES ($1, $2, $3, $4, $5, $6, $7)',
                        [uploadId, date, product, category, region, qty, prc]
                    );
                    if (insertRes.rowCount > 0) inserted += 1;
                }

                await client.query('COMMIT');
                res.status(201).json({ message: 'Sales data uploaded successfully', count: inserted });
            } catch (err) {
                if (client) {
                    try { await client.query('ROLLBACK'); } catch (rbErr) { console.error(rbErr); }
                }
                console.error('UPLOAD ERROR:', err);
                res.status(500).json({ message: `Upload Error: ${err.message}` });
            } finally {
                if (client) client.release();
                try { fs.unlinkSync(req.file.path); } catch (e) { /* ignore */ }
            }
        });
};

const trackDownload = async (req, res) => {
    try {
        const userId = req.user.id;
        await db.query('INSERT INTO downloads (user_id) VALUES ($1)', [userId]);
        res.json({ message: 'Download tracked' });
    } catch (err) {
        console.error('Error tracking download:', err);
        res.status(500).json({ message: 'Server error tracking download' });
    }
};

const getSalesStats = async (req, res) => {
    try {
        const totalSales = await db.query('SELECT COALESCE(SUM(total_amount), 0) as total_revenue, COUNT(id) as total_orders, COALESCE(SUM(quantity), 0) as total_quantity FROM sales');

        // Category breakdown for Dashboard
        const categorySales = await db.query('SELECT category, SUM(total_amount) as sales FROM sales GROUP BY category');

        // User specific stats (Downloads)
        let myDownloads = 0;
        if (req.user && req.user.id) {
            const downloadsRes = await db.query('SELECT COUNT(*) as count FROM downloads WHERE user_id = $1', [req.user.id]);
            myDownloads = parseInt(downloadsRes.rows[0].count);
        }

        const summary = {
            total_revenue: parseFloat(totalSales.rows[0].total_revenue),
            total_orders: parseInt(totalSales.rows[0].total_orders),
            total_quantity: parseInt(totalSales.rows[0].total_quantity),
            my_downloads: myDownloads
        };

        res.json({
            summary,
            category: categorySales.rows.map(row => ({ category: row.category, sales: parseFloat(row.sales) }))
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const clearSales = async (req, res) => {
    try {
        await db.query('TRUNCATE TABLE sales RESTART IDENTITY'); // Clears table and resets IDs
        res.json({ message: 'All sales data cleared successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error: Could not clear data' });
    }
};

const getSalesAnalysis = async (req, res) => {
    try {
        // Monthly trend
        const monthlySales = await db.query(`
            SELECT TO_CHAR(date, 'Mon') as name, SUM(total_amount) as value 
            FROM sales 
            GROUP BY TO_CHAR(date, 'Mon'), EXTRACT(MONTH FROM date)
            ORDER BY EXTRACT(MONTH FROM date)
        `);

        // Category distribution
        const categorySales = await db.query('SELECT category as name, SUM(total_amount) as value FROM sales GROUP BY category');

        // Region distribution
        const regionSales = await db.query('SELECT region as name, SUM(total_amount) as value FROM sales GROUP BY region');

        res.json({
            monthly: monthlySales.rows.map(row => ({ ...row, value: parseFloat(row.value) })),
            category: categorySales.rows.map(row => ({ ...row, value: parseFloat(row.value) })),
            region: regionSales.rows.map(row => ({ ...row, value: parseFloat(row.value) }))
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const getSales = async (req, res) => {
    try {
        const { startDate, endDate, region, product, category } = req.query;

        let query = 'SELECT * FROM sales WHERE 1=1';
        const params = [];
        let paramIndex = 1;

        if (startDate) {
            query += ` AND date >= $${paramIndex++}`;
            params.push(startDate);
        }
        if (endDate) {
            query += ` AND date <= $${paramIndex++}`;
            params.push(endDate);
        }
        if (region && region !== 'All') {
            query += ` AND region = $${paramIndex++}`;
            params.push(region);
        }
        if (product && product !== 'All') {
            query += ` AND product ILIKE $${paramIndex++}`;
            params.push(`%${product}%`);
        }
        if (category && category !== 'All') {
            query += ` AND category = $${paramIndex++}`;
            params.push(category);
        }

        query += ' ORDER BY date DESC LIMIT 500'; // Limit 500 for safety

        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const getUploadHistory = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT u.id, u.filename, u.uploaded_at, COUNT(s.id) as record_count 
            FROM uploads u 
            LEFT JOIN sales s ON u.id = s.upload_id 
            GROUP BY u.id 
            ORDER BY u.uploaded_at DESC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteUpload = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM uploads WHERE id = $1', [id]);
        res.json({ message: 'Upload deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const getFilters = async (req, res) => {
    try {
        const regions = await db.query('SELECT DISTINCT region FROM sales WHERE region IS NOT NULL ORDER BY region');
        const categories = await db.query('SELECT DISTINCT category FROM sales WHERE category IS NOT NULL ORDER BY category');

        res.json({
            regions: regions.rows.map(r => r.region),
            categories: categories.rows.map(c => c.category)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { uploadSales, getSalesStats, getSalesAnalysis, getSales, clearSales, getUploadHistory, deleteUpload, getFilters, trackDownload };
