// backend/src/routes/stationRoutes.js

const express = require('express');
const router = express.Router();
const { searchStations } = require('../controllers/stationController');

router.get('/', searchStations);

module.exports = router;
