const Router = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = Router();

router.get('/logout', authController.logout);
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/verifyMe/:token', authController.verifyMe);


router.get('/me', authController.protect, userController.getMe);
// router.get('/updateMe, authController.protect, userController.updateMe');
// router.delete('/deleteMe', userController.deleteMe);


// router.route('/')
//     .get(userController.getAllUsers);        

module.exports = router;