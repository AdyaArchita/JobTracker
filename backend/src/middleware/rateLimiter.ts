import rateLimit from 'express-rate-limit';
import logger from '../config/logger';

/**
 * @file middleware/rateLimiter.ts
 * Specialized rate limiting for AI-driven endpoints.
 * Prevents excessive API consumption and ensures system stability.
 */

export const aiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 JD parses per minute
  message: {
    message: 'Too many AI requests. Please wait a minute before trying again.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(options.statusCode).send(options.message);
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 login attempts per 15 minutes
  message: {
    message: 'Too many login attempts. Please try again after 15 minutes.',
  },
});
