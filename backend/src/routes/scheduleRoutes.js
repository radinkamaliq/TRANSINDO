// backend/src/routes/scheduleRoutes.js
const express = require('express');
const auth = require('../middleware/auth');
const {
  listSchedules, createSchedule, updateSchedule, deleteSchedule,
} = require('../controllers/scheduleController');

const router = express.Router();
router.use(auth);

router.get('/',    listSchedules);
router.post('/',   createSchedule);
router.patch('/:id',  updateSchedule);
router.delete('/:id', deleteSchedule);

module.exports = router;
