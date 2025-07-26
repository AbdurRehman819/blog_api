const userController= require('../controllers/userController');
const express= require('express');
const router= express.Router();
const {jwtAuthMiddleWare}=require('../middlewares/authMiddleware');
const upload=require('../middlewares/upload');
const {checkRole}=require('../middlewares/roleAuth');





//authenticated user routes
router.get('/profile',jwtAuthMiddleWare,userController.getUserProfile);
router.put('/update-profile',jwtAuthMiddleWare,upload.single('Picture'),userController.updateUser);
router.put('/update-password',jwtAuthMiddleWare,userController.updatePassword);

//admin routes
router.get('/all',jwtAuthMiddleWare,checkRole(['admin']),userController.getAllUsers);
router.delete('/:id',jwtAuthMiddleWare,checkRole(['admin']),userController.deleteUser);


module.exports=router;
