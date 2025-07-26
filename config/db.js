const mongoose= require('mongoose');
const logger = require('../utils/logger'); 
require('dotenv').config();

const mongodbUrl=process.env.MONGODB_URL || 'mongodb://localhost:27017/blog'; 

mongoose.connect(mongodbUrl,{useNewUrlParser:true,useUnifiedTopology:true});

const db=mongoose.connection;


db.on('connected',()=>logger.info('Mongodb connected successfully'));


db.on('disconnected',()=>logger.info('Mongodb disconnected'));


db.on('error',(error)=>logger.error('Mongodb connection error',error));



module.exports=db;