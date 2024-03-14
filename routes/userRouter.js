const Router = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const rateLimit = require('express-rate-limit');

const router = Router();


const authLimit = rateLimit({
    max: 10,
    windowMs: 5 * 60 * 1000,
    message: 'هناك الكثير من الطلبات الرجاء المحاوله مره اخرى خلال 5 دقائق'
});

const limit = rateLimit({
    max: 300,
    windowMs: 5 * 60 * 1000,
    message: 'هناك الكثير من الطلبات الرجاء المحاوله مره اخرى خلال 5 دقائق'
});

router.post('/signup', authLimit, authController.signup);
router.post('/login', authLimit, authController.login);

router.post('/forgotPassword', authLimit, authController.forgotPassword);
router.patch('/resetPassword', authController.resetPassword);
router.post('/resetToken', authController.resetToken);

router.get('/verifyMe/:token', authController.verifyMe);


router.get('/top', limit, authController.loggedIn, userController.getTopUsers);
// router.get('/analytics', authController.loggedIn, userController.getAnalytics);

router.get('/logout', limit, authController.protect, authController.logout);
router.get('/me', limit, authController.protect, userController.getMe);
router.patch('/updateMe', limit, authController.protect, userController.updateMe);
router.patch('/changePassword', authLimit, authController.protect, userController.changePassword);


module.exports = router;