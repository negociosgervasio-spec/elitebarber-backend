const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const scheduleValidator = require('../middlewares/scheduleValidator');

router.post('/', scheduleValidator, scheduleController.createSchedule);
router.get('/', scheduleController.getSchedules);
router.get('/:id', scheduleController.getScheduleById);
router.put('/:id', scheduleValidator, scheduleController.updateSchedule);
router.delete('/:id', scheduleController.deleteSchedule);

module.exports = router;
