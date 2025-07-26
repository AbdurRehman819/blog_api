const mongoose = require('mongoose');
const bcrypt=require('bcrypt');
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true}
,
    password:{
        type: String,
        required: true,
        minlength: 6
    },
    role:{
        type: String,
        enum: ['user', 'admin','author'],
        default: 'user'
        
    },
    Picture: {
 
        url: {
          type: String,
   // default:, // can be a default avatar link
             },
    public_id: {
    type: String,
                }
},
    bio: {
        type: String,
        maxlength: 300,
        trim: true
    },

    socialLinks:{

    facebook: { type: String, trim: true },
    twitter: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    github: { type: String, trim: true }

    },
        
    emailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: String,
    passwordResetToken: String,
    passwordResetExpires: Date,


},{timestamps: true});


userSchema.pre('save',async function(next){
    user=this;
    if(!user.isModified('password')) return next();

    try{
        const salt=await  bcrypt.genSalt(10);
        const hash=await bcrypt.hash(user.password,salt);
        user.password=hash;
        next();
    }catch(err)
        {
        next(err);
        }    
});


userSchema.methods.comparePassword=async function(candidatePassword){
    return await bcrypt.compare(candidatePassword,this.password);
};


const User = mongoose.model('User', userSchema);
module.exports = User;