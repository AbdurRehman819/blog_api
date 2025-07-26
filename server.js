const express=require('express');
const app=express();
require('./config/db');
const categoryRouter=require('./routes/categoryRoutes');
const tagRouter=require('./routes/tagRoutes');
const postRouter=require('./routes/postRoutes');
const commentRouter=require('./routes/commentRoutes');
const userRouter = require('./routes/userRoutes');
const authRouter=require('./routes/authRoutes');
const rateLimiterMiddleware = require('./middlewares/rateLimiter');

app.use(express.json()); // ✅ This parses JSON bodies

// app.use(rateLimiterMiddleware);

app.use('/api/categories',categoryRouter);

app.use('/api/user', userRouter);

app.use('/api/tags',tagRouter);

app.use('/api/posts',postRouter);

app.use('/api/comments',commentRouter);

app.use('/api/auth',authRouter);
const logger = require('./utils/logger');

app.listen(3000,()=>
    logger.info('Server started on port 3000')
);