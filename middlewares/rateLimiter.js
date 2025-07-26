// const { RateLimiterRedis } = require('rate-limiter-flexible');
// const redisClient = require('../config/redis');

// const rateLimiter = new RateLimiterRedis({
//   storeClient: redisClient,
//   keyPrefix: 'rl',
//   points: 100,
//   duration: 15 * 60,
// });

// const rateLimiterMiddleware = async (req, res, next) => {
//   try {
//     await rateLimiter.consume(req.ip); // Consume 1 point per request
//     next(); // Allow request
//   } catch (err) {
//     res.status(429).json({
//       message: 'Too many requests. Please try again later.',
//     });
//   }
// };

// module.exports = rateLimiterMiddleware;
