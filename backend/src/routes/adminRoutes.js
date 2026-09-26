// backend/src/routes/adminRoutes.js
const express = require('express');
const auth = require('../middleware/auth');
const authorizeRoles = require('../middleware/role');
const a = require('../controllers/adminController');

const router = express.Router();
router.use(auth);
router.use(authorizeRoles('admin'));

// Dashboard
router.get('/dashboard', a.getDashboardStats);

// Operators
router.get('/operators',       a.listOperators);
router.post('/operators',      a.createOperator);
router.patch('/operators/:id', a.updateOperator);
router.delete('/operators/:id', a.deleteOperator);

// Transport Types
router.get('/transport-types',        a.listTransportTypes);
router.post('/transport-types',       a.createTransportType);
router.patch('/transport-types/:id',  a.updateTransportType);
router.delete('/transport-types/:id', a.deleteTransportType);

// Cities
router.get('/cities',        a.listCities);
router.post('/cities',       a.createCity);
router.delete('/cities/:id', a.deleteCity);

// Stations
router.get('/stations',        a.listStationsAdmin);
router.post('/stations',       a.createStation);
router.patch('/stations/:id',  a.updateStation);
router.delete('/stations/:id', a.deleteStation);

// Routes
router.get('/routes',        a.listRoutes);
router.get('/routes/:id',    a.getRoute);
router.post('/routes',       a.createRoute);
router.patch('/routes/:id',  a.updateRoute);
router.delete('/routes/:id', a.deleteRoute);

// Schedules
router.get('/schedules',        a.listSchedulesAdmin);
router.post('/schedules',       a.createScheduleAdmin);
router.delete('/schedules/:id', a.deleteScheduleAdmin);

// Fares
router.get('/fares',        a.listFares);
router.post('/fares',       a.createFare);
router.delete('/fares/:id', a.deleteFare);

// Users
router.get('/users',        a.listUsers);
router.patch('/users/:id',  a.updateUser);

// Reports
router.get('/reports',        a.getDashboardStats); // also serves stats
router.get('/reports/list',   require('../controllers/reportController').adminListReports);
router.patch('/reports/:id',  require('../controllers/reportController').adminUpdateReport);

module.exports = router;
