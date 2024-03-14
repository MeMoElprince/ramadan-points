const Router = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const rateLimit = require('express-rate-limit');

const router = Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword', authController.resetPassword);
router.post('/resetToken', authController.resetToken);

router.get('/verifyMe/:token', authController.verifyMe);


router.get('/top',  authController.loggedIn, userController.getTopUsers);
// router.get('/analytics', authController.loggedIn, userController.getAnalytics);

router.get('/logout', authController.protect, authController.logout);
router.get('/me',  authController.protect, userController.getMe);
router.patch('/updateMe',  authController.protect, userController.updateMe);
router.patch('/changePassword', authController.protect, userController.changePassword);


module.exports = router;