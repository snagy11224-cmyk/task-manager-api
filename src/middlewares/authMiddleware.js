const { body, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const { isTokenBlacklisted } = require('../services/authService')


const validateRegister = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  }
]

const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  }
]

// Middleware to protect routes
// 1. Check for the presence of a JWT token in the Authorization header of the request.
// 2. If the token is not present, return a 401 status code with an error message.
// 3. If the token is present, verify it using the JWT secret.
// 4. If the token is invalid, return a 401 status code with an error message.
// 5. If the token is valid, extract the user ID from the token and attach it to the request object (e.g., req.userId) for use in subsequent middleware or route handlers.
// 6. Additionally, check if the token has been blacklisted (e.g., due to logout) and if so, return a 401 status code with an error message indicating that the token is invalidated.
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, unauthorized' })
  }

  const token = authHeader.split(' ')[1]

  const blacklisted = await isTokenBlacklisted(token)
  if (blacklisted) {
    return res.status(401).json({ message: 'Token has been invalidated, please login again' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.userId
    req.token = token
    next()
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' })
  }
}

module.exports = { validateRegister, validateLogin , protect }