// backend/src/routes/reportRoutes.js
const express = require('express');
const auth = require('../middleware/auth');
const authorizeRoles = require('../middleware/role');
const { listMyReports, createReport, adminListReports, adminUpdateReport } = require('../controllers/reportController');

const router = express.Router();

// User routes (auth required)
router.get('/',  auth, listMyReports);
router.post('/', auth, createReport);

// Admin routes
router.get('/admin',      auth, authorizeRoles('admin'), adminListReports);
router.patch('/admin/:id', auth, authorizeRoles('admin'), adminUpdateReport);

module.exports = router;
