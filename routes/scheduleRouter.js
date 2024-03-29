const Router = require('express');

const scheduleController = require('../controllers/scheduleController');
const authController = require('../controllers/authController');

const router = Router();


router.get('/comming', scheduleController.comming);
router.get('/running', authController.loggedIn, scheduleController.running);

router.patch('/acceptSchedule/:id', authController.protect, scheduleController.acceptSchedule);


module.exports = router;