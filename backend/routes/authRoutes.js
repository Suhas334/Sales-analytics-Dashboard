const express = require('express');
const router = express.Router();
const { register, login, forgotPassword, resetPassword, updateProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resetToken', resetPassword);
router.put('/profile', authMiddleware, updateProfile);

module.exports = router;
