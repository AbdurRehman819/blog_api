const Category= require('../models/categoryModel');
const logger= require('../utils/logger'); 
const Post = require('../models/postModel'); // Assuming you have a Post model to fetch posts by category
exports.createCategory=async(req,res)=>{
    try{
        const {name}=req.body;
        if(!name)return res.status(400).json({ message: 'Name is required' });
        
        const isExist=await Category.findOne({name});
        if(isExist) return res.status(400).json({ message: 'Category already exists' });

        const category= new Category({name});

        await category.save();
        res.status(201).json({ message: 'Category created successfully', category });

    }catch(err){
        logger.error('Error creating category:', err);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.getCategories=async(req,res)=>{
    try{
        const categories=await Category.find().sort({createdAt: -1});
        res.status(200).json({ message: 'Categories fetched successfully', categories });
    }catch(err){
        logger.error('Error fetching categories:', err);
        res.status(500).json({ message: 'Error fetching categories' });
    }
}



exports.getCategoryBySlug=async(req,res)=>{
    try{
        const slug= req.params.slug;

        const category= await Category.findOne({slug:slug});
         if(!category)return res.status(404).json("category not found");

       const posts=await Post.find({category:category._id}).populate('category','name').populate('author','name').populate('tags','name email').sort({createdAt:-1});
        
       res.status(200).json({message:"Category fetched successfully",category,posts});
    }catch(err){
        logger.error('Error fetching category:', err);
        res.status(400).json({message:"Failed to get category"});
    }
}



exports.deleteCategory=async(req,res)=>{
   try{
    const categoryID=req.params.id;
    const deleteCategory= await Category.findByIdAndDelete(categoryID);
   
    if(!deleteCategory) return res.status(404).json({message:"Category not found"});
   
    res.status(200).json({message:"Category deleted successfully"});

   }catch(err){
    logger.error('Error deleting category:', err);
    res.status(400).json({message:"Failed to delete category"})

   }
}