const mongoose = require('mongoose');
const sulgify=require('slugify');
const postSchema = new mongoose.Schema({
       title:{
           type: String,
           required: true,
           trim: true
        },

         content: {
                  type: String,
                  required: true
                 },
         author:{
                 type: mongoose.Schema.Types.ObjectId,
                 ref: 'User',
                 required: true
         },
         category:{
                   type: mongoose.Schema.Types.ObjectId,
                   ref: 'Category',
            
         },
         
         slug: {
                 type: String,
                 unique: true,
                 lowercase: true,
               },

        image:{
              url:String,
              public_id:String
            
        },
        
        likes: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        ],


        tags:[{
             type: mongoose.Schema.Types.ObjectId,
             ref: 'Tag',
        
        }],

        isPublished: {
            type: Boolean,
            default: false
        },

},{timestamps: true});



postSchema.pre('save', function(next){
    if(this.isModified('title')){
        this.slug = sulgify(this.title,{lower:true});
    }
    next();
});

const Post = mongoose.model('Post', postSchema);


module.exports = Post;