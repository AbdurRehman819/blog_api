const mongoose = require('mongoose');
const slugify = require('slugify');
const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        trim: true
    },
}, { timestamps: true });

tagSchema.pre('save',function(next){
    if(this.isModified('name')){
        this.slug=slugify(this.name,{lower:true});
    }
    next();
});

const Tag = mongoose.model('Tag', tagSchema);
module.exports = Tag;