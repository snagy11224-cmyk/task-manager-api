const rateLimit = require('express-rate-limit')

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // max 100 requests per 15 mins
  message: {
    success: false,
    message: 'Too many requests, please try again later'
  }
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // max 10 login attempts per 15 mins
  message: {
    success: false,
    message: 'Too many login attempts, please try again later'
  }
})

module.exports = { globalLimiter, authLimiter }