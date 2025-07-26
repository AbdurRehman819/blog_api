const router= require('express').Router();
const commentController=require('../controllers/commentController');
const {jwtAuthMiddleWare}=require('../middlewares/authMiddleware');




router.post('/',jwtAuthMiddleWare,commentController.addComment);

router.get('/:id',commentController.getCommentsByPostId);

router.delete('/:id',jwtAuthMiddleWare,commentController.deleteComment);



module.exports=router;