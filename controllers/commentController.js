const Comment = require('../models/commentModel');
const logger = require('../utils/logger'); 

exports.addComment=async(req,res)=>{
    try{

        const {text,postID}=req.body;
        if(!text||!postID) return res.status(400).json({message:"Text and post are required"});
        
        const comment=await Comment.create({
            text,
            user:req.user.id,
            post:postID
        });

        await comment.save();

        res.status(201).json({message:"Comment added successfully",comment});
    }catch(err){

        logger.error('Error adding comment:', err);
        res.status(400).json({message:"Failed to add comment"});

    }
}


exports.getCommentsByPostId=async(req,res)=>{
    try{
        const postID=req.params.id;

        const comments = await Comment.find({post:postID}).populate('user','name').sort({createdAt:-1});


        res.status(200).json({message:"Comments fetched successfully",comments});
    }catch(err){

        logger.error('Error fetching comments:', err);
        res.status(400).json({message:"Failed to get comments"});

    }
}


exports.deleteComment=async(req,res)=>{
   
    try{
         const commentID=req.params.id;
        if(!commentID) return res.status(400).json({message:"Comment id is required"});
        
        const comment = await Comment.findById(commentID);

        if(!comment) return res.status(404).json({message:"Comment not found"});
        
        if(comment.user.toString()!==req.user.id && req.user.role!=='admin') return res.status(401).json({message:"Unauthorized to delete comment"});
        

        await Comment.findByIdAndDelete(commentID);
        res.status(200).json({message:"Comment deleted successfully"});

    }catch(err){

        logger.error('Error deleting comment:', err);
        res.status(400).json({message:"Failed to delete comment"});

    }
}


