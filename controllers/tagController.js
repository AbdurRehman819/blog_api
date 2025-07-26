const Post = require('../models/postModel');
const Tag=require('../models/tagModel');
const logger = require('../utils/logger');


exports.createTag=async(req,res)=>{
    try{
        const {name}=req.body;
        if(!name||name.trim()=='')return res.status(400).json({ message: 'Name is required' });

        const isExist=await Tag.findOne({name:new RegExp(`^${name}$`, 'i')});
        if(isExist) return res.status(409).json({ message: 'Tag already exists' });

        const tag=new Tag({name:name.trim()});
        await tag.save();

        res.status(201).json({ message: 'Tag created successfully', tag });

    }catch(err){
        logger.error('Error creating tag:', err);
        res.status(500).json({ message: 'Server error' });
    }
}


exports.getTagsBySlug=async(req,res)=>{
    try{
        const slug=req.params.slug;
        const tag=await Tag.findOne({slug:slug});
        if(!tag)return res.status(404).json({message:"Tag not found"});


        const posts=await Post.find({tags:tag._id})
        .populate('category','name')
        .populate('author','name')
        .populate('tags','name email')
        .sort({createdAt:-1});     
        
        res.status(200).json({message:"Tag fetched successfully",tag,posts});

    }catch(err){
        logger.error('Error fetching tag:', err);
        res.status(400).json({message:"Failed to get tag"})
    }
}





exports.getAllTags=async(req,res)=>{
    try{
        const tags=await Tag.find().sort({createdAt: -1});

        res.status(200).json({ message: 'Tags fetched successfully', tags });

    }catch(err){
        logger.error('Error fetching tags:', err);
        res.status(500).json({ message: 'Error fetching tags' });
    }
}





exports.deleteTag=async(req,res)=>{
    try{
        const tagID=req.params.id;
        const deleteTag= await Tag.findByIdAndDelete(tagID);

        if(!deleteTag) return res.status(404).json({message:"Tag not found"});
        res.status(200).json({message:"Tag deleted successfully"});
    }catch(err){
        console.log(err);
        res.status(400).json({message:"Failed to delete tag"})
    }
}