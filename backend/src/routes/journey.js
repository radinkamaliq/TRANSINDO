// backend/src/routes/journey.js

const express = require('express');
const router = express.Router();

const journeyController = require('../controllers/journeyController');
const optionalAuth      = require('../middleware/optionalAuth');

// Optional authentication allows guests per PRD §13.2 FR-JP-06
router.use(optionalAuth);

// POST /api/journey/plan
router.post('/plan', journeyController.plan);

// GET /api/journey/:id
router.get('/:id', journeyController.getPlan);

module.exports = router;
