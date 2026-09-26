// backend/src/routes/exploreRoutes.js
const express = require('express');
const { exploreRoutes, listCities, listTransportTypes, listOperators, getRoute } = require('../controllers/adminController');

const router = express.Router();

// Public explorer endpoints
router.get('/',           exploreRoutes);
router.get('/cities',     listCities);
router.get('/transport-types', listTransportTypes);
router.get('/operators',  listOperators);
router.get('/routes/:id', getRoute);

module.exports = router;
