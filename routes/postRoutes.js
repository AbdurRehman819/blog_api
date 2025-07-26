const router= require('express').Router();
const postController=require('../controllers/postController');
const upload=require('../middlewares/upload');
const {jwtAuthMiddleWare}=require('../middlewares/authMiddleware');

router.post('/',jwtAuthMiddleWare,upload.single('image'),postController.createPost);

router.get('/',postController.getAllPosts);

router.get('/slug/:slug',postController.getPostsBySlug);

router.put('/:id',jwtAuthMiddleWare,postController.updatePost);

router.delete('/:id',jwtAuthMiddleWare,postController.deletePost);

router.patch('/like/:id',jwtAuthMiddleWare,postController.toggleLikePost);

router.get('/likes/:id',jwtAuthMiddleWare,postController.getPostLikes);


module.exports=router;