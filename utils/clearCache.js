// const redis= require('../config/redis');

// const clearCache=async()=>{
//     const keys=await redis.keys('posts:*');
//     if(keys.length>0){
//         await redis.del(keys);
//         console.log(`Cleared ${keys.length} post cache(s)`);

//     }
// }

// module.exports=clearCache;