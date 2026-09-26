const express = require('express');
const { register, login, logout, getCurrentUser, demoLogin } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/demo', demoLogin);
router.post('/logout', logout);
router.get('/me', getCurrentUser);

module.exports = router;
