const router= require('express').Router();
const categoryController=require('../controllers/categoryController');
const{jwtAuthMiddleWare}=require('../middlewares/authMiddleware')


router.post('/',jwtAuthMiddleWare,categoryController.createCategory);

router.get('/',categoryController.getCategories);

router.get('/slug/:slug',categoryController.getCategoryBySlug);

router.delete('/:id',jwtAuthMiddleWare,categoryController.deleteCategory);



module.exports=router;