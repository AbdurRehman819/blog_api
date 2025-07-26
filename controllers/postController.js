const Post = require('../models/postModel');
const uploadToCloudinary = require('../utils/uploadCloudinary');
const logger = require('../utils/logger');
// const redis= require('../config/redis');
// const clearCache = require('../utils/clearCache');
exports.createPost=async(req,res)=>{
   try{
     const {title,content,category,isPublished,tags}= req.body;
     let imageData={};
    // console.log(req.file);
   if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageData = {
        url: result.secure_url,
        public_id: result.public_id
      };
    }
    const newPost=new Post({
        title,
        content,
        category,
        isPublished,
        author:req.user.id,
        tags,
        image:imageData
    });
    await newPost.save();
    // await clearCache(); // Clear cache after creating a new post
    res.status(200).json({message:"Post succussfully created"})
   }catch(err){
    logger.error('Error creating post:', err);
    res.status(400).json({message:"Failed to create post"})
   }
    
    
}


exports.getAllPosts=async(req,res)=>{
    try{
         const {page=1,limit=10,category,author,tags,search=""}=req.query;

         const filter={};
         if(category)
             filter.category=category;

         if(author)
             filter.author=author;

         if(tags)
             filter.tags=tags;

         if(search){
          filter.title={ $regex: search, $options: 'i'};
         }

      //  const cacheKey = `posts:${page}:${limit}:${category || "all"}:${author || "all"}:${tags || "all"}:${search}`;
       
      //  const cached=await redis.get(cacheKey);
      //  if(cached)return res.status(200).json(JSON.parse(cached));

      const total= await Post.countDocuments(filter);
      const posts=await Post.find(filter).populate('author','name')
      .populate('category','name')
      .populate('tags','name')
      .sort({createdAt:-1}).skip((page-1)*limit).limit(limit);

      const postsWithLikes = posts.map(post => ({
      ...post.toObject(),
      likesCount: post.likes?.length || 0,
    }));
    
    // await redis.set(cacheKey, JSON.stringify(postsWithLikes), {ex:36000});// Cache for 10 hours

     res.status(200).json({
      message: 'Posts fetched successfully',
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
      posts: postsWithLikes,
    });
    }catch(err){
        logger.error('Error fetching posts:', err);
        res.status(400).json({message:"Failed to get posts"})
    }
}


exports.getPostsBySlug=async(req,res)=>{
  try
  {
    const slug=req.params.slug;
    const post=await Post.findOne({slug}).populate('category').populate('author').populate('tags','name email');

    if(!post) return res.status(404).json({message:"Post not found"});

    const postWithLikes = {
      ...post.toObject(),
      likesCount: post.likes?.length || 0,
    };
    
    res.status(200).json({message:"Post fetched successfully", post: postWithLikes});   
  } 
  catch(err)
  {
    logger.error('Error fetching post by slug:', err);
    res.status(400).json({message:"Failed to get post"})
  }
}

exports.updatePost=async(req,res)=>{
  try{
  const postID=req.params.id;
  const post=await Post.findById(postID);
  if(!post) res.status(404).json({message:"Post not found"});

  const {title,content,category,tags}=req.body;
  Object.assign(post,{title,content,category,tags});
  updatedPost=await post.save();
  // await clearCache(); // Clear cache after updating a post
  res.status(200).json({message:"Post updated successfully",updatedPost});
  }
  catch(err)
  {
    logger.error('Error updating post:', err);
    res.status(400).json({message:"Failed to update post"})
  }
}


exports.deletePost=async(req,res)=>{
  try{
    const postID=req.params.id;
    if(!postID) return res.status(400).json({message:"Post ID is required"});

    const post=await Post.findById(postID);
    if(!post) return res.status(404).json({message:"Post not found"});

     if (
      !req.user ||
      (req.user.role !== 'admin' && (!post.author || !post.author._id || post.author._id.toString() !== req.user._id))
    ) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }
       
    const deletedPost = await Post.findByIdAndDelete(postID);

    if(!deletedPost) return res.status(404).json({message:"Post not found"});
    // await clearCache(); // Clear cache after deleting a post
    res.status(200).json({message:"Post deleted successfully"});
  }
  catch(err){
    logger.error('Error deleting post:', err);
    res.status(400).json({message:"Failed to delete post"});
  }
}

exports.toggleLikePost=async(req,res)=>{
  try{
     const postID = req.params.id;
     const userID = req.user.id;

     const post=await Post.findById(postID);
     if(!post) return res.status(404).json({message:"Post not found"});
     const isLiked=post.likes.includes( userID);

     if(isLiked){

      post.likes.pull(userID);
      
     }
     else{

      post.likes.push(userID);

     }
     await post.save();

     res.status(200).json({message:isLiked?"Post unliked successfully":"Post liked successfully",likesCount: post.likes.length,
      });

  }catch(err){
    logger.error('Error liking post:', err);
    res.status(400).json({message:"Failed to like post"});
  }
}

exports.getPostLikes = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await Post.findById(postId).populate('likes', 'name email');
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.status(200).json({
      message: "Users who liked this post",
      likes: post.likes,
      likesCount: post.likes.length,
    });
  } catch (err) {
    logger.error('Error fetching post likes:', err);
    res.status(500).json({ message: "Failed to get likes" });
  }
};