const User= require('../models/userModel');
const uploadToCloudinary=require('../utils/uploadCloudinary');
const logger = require('../utils/logger');

//only admin can get all users
exports.getAllUsers=async(re,res)=>{
    try{
        const users=await User.find().select('-password');

        res.status(200).json({message:"Users fetched successfully",users});
    }catch(err){
        logger.error('Error fetching users:', err);
        res.status(400).json({message:"Failed to get users"});
    }
}

//get current user profile
exports.getUserProfile=async(req,res)=>{
    try{
        const userID=req.user.id;
        const user= await User.findById(userID).select('-password');

        res.status(200).json({message:"User fetched successfully",user});
    }catch(err){
        logger.error('Error fetching user:', err);
        res.status(400).json({message:"Failed to get user"});

    }

}


exports.updateUser=async(req,res)=>{
    try{
        const {name,bio,socialLinks}=req.body;
        const userID=req.user.id;

        const updates={};
        if(name) updates.name=name;
        if(bio) updates.bio=bio;
        if(socialLinks) updates.socialLinks=socialLinks;

        if(req.file){
            const result=await uploadToCloudinary(req.file.buffer,'users');
            updates.Picture={
                url:result.secure_url,
                filename:result.public_id
            }
        }

        const updatedUser=await User.findByIdAndUpdate(userID,updates,{new:true});
        res.status(200).json({message:"User updated successfully",updatedUser});
               
    }catch(err){
        logger.error('Error updating user:', err);
        res.status(400).json({message:"Failed to update user"});
    }
}

exports.updatePassword=async(req,res)=>{
    try{
        const userID=req.user.id;
        const user=await User.findById(userID);
        if(!user) return res.status(404).json({message:"User not found"});

        const {currentPassword,newPassword,confirmPassword}=req.body;
        if(!currentPassword||!newPassword||!confirmPassword) return res.status(400).json({message:"All fields are required"});
        if(newPassword!==confirmPassword) return res.status(400).json({message:"Passwords do not match"});
        
        const isMatch= await user.comparePassword(currentPassword);
        if(!isMatch) return res.status(400).json({message:"Current password is incorrect"});
        
        user.password=newPassword;
        await user.save();
        res.status(200).json({message:"Password updated successfully"});

    }catch(err){
        logger.error('Error updating password:', err);
        res.status(400).json({message:"Failed to update password"});

    }
}


//admin only
exports.deleteUser=async(req,res)=>{
    try{
        const userID=req.params.id;
        const user=await User.findByIdAndDelete(userID);
        if(!user) return res.status(404).json({message:"User not found"});
        res.status(200).json({message:"User deleted successfully"});
    }
    catch(err){
        logger.error('Error deleting user:', err);
        res.status(400).json({message:"Failed to delete user"});
    }
}