// backend/src/routes/journey.js

const express = require('express');
const router = express.Router();

const journeyController = require('../controllers/journeyController');
const authMiddleware    = require('../middleware/auth');
const authorizeRoles   = require('../middleware/role');

// All journey endpoints require authentication
router.use(authMiddleware);
router.use(authorizeRoles('user', 'admin'));

// POST /api/journey/plan
router.post('/plan', journeyController.plan);

// GET /api/journey/:id
router.get('/:id', journeyController.getPlan);

module.exports = router;
