const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendResetEmail } = require('../utils/emailService');

const register = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email and password are required' });
    }

    try {
        const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await db.query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
            [name, email, hashedPassword, role || 'salesmanager']
        );

        res.status(201).json(newUser.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.rows[0].password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: user.rows[0].id,
                role: user.rows[0].role
            }
        };

        // Update last_login
        await db.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.rows[0].id]);

        // Get updated user data with last_login
        const updatedUser = await db.query('SELECT * FROM users WHERE id = $1', [user.rows[0].id]);

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                // Return full user details including email and last_login
                res.json({
                    token,
                    user: {
                        id: updatedUser.rows[0].id,
                        name: updatedUser.rows[0].name,
                        email: updatedUser.rows[0].email,
                        role: updatedUser.rows[0].role,
                        last_login: updatedUser.rows[0].last_login
                    }
                });
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate Token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Hash and save to DB
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Expire in 15 minutes
        const resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 mins from now in UTC locally (assuming DB is local time or handled correctly)
        // Ideally use database time or UTC. For simplicity:
        // Postgres timestamp input format is flexible.

        await db.query(
            'UPDATE users SET reset_password_token = $1, reset_password_expire = $2 WHERE id = $3',
            [resetPasswordToken, resetPasswordExpire, user.rows[0].id]
        );


        try {
            await sendResetEmail(user.rows[0].email, user.rows[0].name, resetToken);
            res.status(200).json({ success: true, data: 'Email sent' });
        } catch (err) {
            console.error(err);
            // Clear fields if email fails
            await db.query(
                'UPDATE users SET reset_password_token = NULL, reset_password_expire = NULL WHERE id = $1',
                [user.rows[0].id]
            );
            return res.status(500).json({ message: 'Email could not be sent' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const resetPassword = async (req, res) => {
    const { resetToken } = req.params;
    const { password } = req.body;

    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    console.log('--- Debug Reset Password ---');
    console.log('Received raw token:', resetToken);
    console.log('Computed hash:', resetPasswordToken);
    console.log('Checking expiration >', new Date());

    try {
        // Debug: Check if token exists at all, ignoring expiration
        const tokenCheck = await db.query('SELECT * FROM users WHERE reset_password_token = $1', [resetPasswordToken]);
        console.log('Token exists in DB?', tokenCheck.rows.length > 0);
        if (tokenCheck.rows.length > 0) {
            console.log('DB Expiration:', tokenCheck.rows[0].reset_password_expire);
            console.log('Is Expired?', new Date() > new Date(tokenCheck.rows[0].reset_password_expire));
        }

        const user = await db.query(
            'SELECT * FROM users WHERE reset_password_token = $1 AND reset_password_expire > $2',
            [resetPasswordToken, new Date()]
        );

        if (user.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Salt and Hash new password
        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(password, salt);

        await db.query(
            'UPDATE users SET password = $1, reset_password_token = NULL, reset_password_expire = NULL WHERE id = $2',
            [newPassword, user.rows[0].id]
        );

        res.status(200).json({ success: true, data: 'Password reset success' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateProfile = async (req, res) => {
    const { name, email } = req.body;
    // Assuming middleware checks auth and adds req.user
    // But since authMiddleware adds req.user from token, we need to check if we have it.
    // NOTE: In many setups, req.user.id is available. 
    // We will assume authMiddleware is used on this route.

    // However, I don't see authMiddleware being used in the routes file yet for these endpoints, 
    // so I will need to handle getting ID, or better, add auth middleware to the route.
    // For now, let's assume the ID is passed or available via req.user if middleware is attached.
    // Let's standardly expect req.user from a middleware.

    // Wait, looking at authRoutes.js, there is no middleware applied.
    // I should probably rely on the user sending their token, but typically the protected route middleware handles this.
    // Given the constraints and existing code style, I'll see if I can get the ID from the request user object
    // which should be populated by middleware.

    // If middleware isn't set up on the route, I'll have to add it there.

    const userId = req.user?.id; // This requires authMiddleware

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const updatedUser = await db.query(
            'UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email) WHERE id = $3 RETURNING id, name, email, role, last_login',
            [name, email, userId]
        );
        res.json(updatedUser.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { register, login, forgotPassword, resetPassword, updateProfile };
