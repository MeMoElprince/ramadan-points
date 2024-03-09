const Router = require('express');

const scheduleController = require('../controllers/scheduleController');
const authController = require('../controllers/authController');

const router = Router();


router.get('/comming', authController.protect, scheduleController.comming);
router.get('/running', authController.protect, scheduleController.running);

router.patch('/acceptSchedule/:id', authController.protect, scheduleController.acceptSchedule);


module.exports = router;