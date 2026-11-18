import rateLimit from 'express-rate-limit';
import env from '../config/env.js';
import { errorResponse } from '../utils/response.js';

/**
 * Global API rate limiter middleware
 */
export const apiRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  handler: (req, res) => {
    return errorResponse(res, {
      statusCode: 429,
      message: 'Too many requests from this IP, please try again later.',
    });
  },
  skip: () => env.NODE_ENV === 'test', // Skip rate limiting in tests
});

export default apiRateLimiter;
