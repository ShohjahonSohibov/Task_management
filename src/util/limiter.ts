import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 3 * 60 * 1000, // 3 minutes window
  max: 5, // Limit to 5 requests per window
  message: { message: 'Too many login attempts. Please try again later.' },
});

export default limiter;