const router=require('express').Router();
const tagController=require('../controllers/tagController');

router.post('/',tagController.createTag);

router.get('/',tagController.getAllTags);

router.get('/slug/:slug',tagController.getTagsBySlug);

router.delete('/:id',tagController.deleteTag);


module.exports=router;