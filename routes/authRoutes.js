const router=require('express').Router();

const authController=require('../controllers/authController');

router.post('/signup',authController.registerUser);


router.get('/verify-email/:token',authController.emailVerification);


router.post('/login',authController.loginUser);

router.post('/forgot-password',authController.forgetPassword);

router.post('/reset-password/:token',authController.resetPassword);

module.exports=router;
