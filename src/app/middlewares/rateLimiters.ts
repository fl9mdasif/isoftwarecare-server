import rateLimit from 'express-rate-limit';

// Auth endpoints (login/refresh) — tight limit, the classic brute-force /
// credential-stuffing target.
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: 'Too many attempts. Please try again later.',
  },
});

// POST /leads — the only public write endpoint on the whole site, and the
// site's #1 spam target. Capped tightly per IP.
export const leadRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: 'Too many submissions from this device. Please try again later.',
  },
});
