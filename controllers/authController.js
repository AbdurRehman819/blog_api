const User=require('../models/userModel');
const sendEmail=require('../utils/sendEmail');
const crypto=require('crypto');
const {generateToken}=require('../middlewares/authMiddleware');
const generateHashedToken=require('../utils/generateHashedToken');
const verifyTemplate=require('../templates/verifyEmailTemplate');
const resetPasswordTemplate=require('../templates/passwordResetTemplate');
const logger=require('../utils/logger');
exports.registerUser=async(req,res)=>{
    try{
        const {name,email,password}=req.body;
        if(!name||!email||!password) return res.status(400).json({message:"All fields are required"});
        const isExist=await User.findOne({email});
        if(isExist) return res.status(400).json({message:"User already exists"});

        const user = new User({ name, email, password });

        const {token,hashedToken}= generateHashedToken();

        user.emailVerificationToken=hashedToken;
        //save user with hashed token
        await user.save();

        const verificationLink= `http://localhost:3000/api/auth/verify-email/${token}`;
        await sendEmail({
            to:user.email,
            subject:"Email Verification",
            html:verifyTemplate(user.name,verificationLink)
        });
        logger.info(`User registered successfully: ${user.email}`);

        res.status(201).json({message:"Verify your account by clicking the link sent to your email",user,token});
    }catch(err){
        logger.error('Error in user registration:', err);
        res.status(400).json({message:"Failed to create user"});
    }
}


exports.emailVerification=async(req,res)=>{
    try{
        const verificationToken=req.params.token;
        const hashedToken=crypto.createHash('sha256').update(verificationToken).digest('hex');

        const user=await User.findOne({emailVerificationToken:hashedToken});
        if(!user) return res.status(404).json({message:"Invalid verification token"});
        
        user.emailVerified=true;
        user.emailVerificationToken=undefined;
        await user.save();
        logger.info(`User email verified successfully: ${user.email}`);
        res.status(200).json({message:"Email verified successfully and you can login now"});


    }catch(err){

        logger.error('Error in email verification:', err);
        res.status(400).json({message:"Failed to verify email"});

    }
}


exports.loginUser=async(req,res)=>{

    try{
        const {email,password}=req.body;
        if(!email||!password) return res.status(400).json({message:"All fields are required"});
        

        const user=await User.findOne({email});
        if(!user) return res.status(404).json({message:"User not found"});

        if(!user.emailVerified) return res.status(403).json({message:"Email not verified"});
        
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: "Password does not match" });

        const token=await generateToken(user);
        logger.info(`User login successfully: ${user.email}`);

        res.status(200).json({message:"Login successful",token});
        
    }catch(err){

        logger.error('Error in user login:', err);
        res.status(400).json({message:"Failed to login"});

    }
    
}



exports.forgetPassword=async(req,res)=>{
    try{
        const {email}=req.body;
        if(!email) return res.status(400).json({message:"Email is required"});
        const user = await User.findOne({email});
        if(!user) return res.status(404).json({message:"User not found"});

        const {token,hashedToken}= generateHashedToken();

        user.passwordResetToken=hashedToken;
        user.passwordResetExpires=Date.now()+15*60*1000; //15  minutes

        await user.save();

        const resetLink= `http://localhost:3000/api/auth/reset-password/${token}`;

        await sendEmail({
            to:user.email,
            subject:"Password Reset",
            html:resetPasswordTemplate(user.name,resetLink)
        })
        logger.info(`Password reset link sent to user: ${user.email}`);
        res.status(200).json({message:"Password reset link sent to your email"});
    }
    catch(err){

        logger.error('Error in password reset:', err);
        res.status(400).json({message:"Failed to reset password"});

    }
}


exports.resetPassword=async(req,res)=>{
    try{
        const token=req.params.token;
         const {newPassword, confirmPassword} = req.body;
                if(newPassword !== confirmPassword) {
                    return res.status(400).json({message: 'Passwords do not match'});
                }
                
                hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const user= await User.findOne({passwordResetToken:hashedToken,passwordResetExpires:{$gt:Date.now()}});
        if(!user) return res.status(404).json({message:"Invalid reset token"});
        
        console.log("thaly ni aya");
        user.password=newPassword;
        user.passwordResetToken=undefined;
        user.passwordResetTokenExpire=undefined;
        await user.save();
        logger.info(`Password reset successfully for user: ${user.email}`);
        res.status(200).json({message:"Password reset successfully"});
    }catch(err){

        logger.error('Error in password reset:', err);
        res.status(400).json({message:"Failed to reset password"});

    }
}