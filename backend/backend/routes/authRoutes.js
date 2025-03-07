
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

// Login route
router.post('/login', authController.login);

// Logout route
router.get('/logout', authController.logout);

// Get current user route
router.get('/me', authenticate, authController.getCurrentUser);

module.exports = router;
