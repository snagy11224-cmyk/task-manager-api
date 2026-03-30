const express = require('express')
const { register, login,logout ,forgotPasswordHandler, resetPasswordHandler } = require('../controllers/authController')
const { validateRegister, validateLogin } = require('../middlewares/authMiddleware')
const { authLimiter } = require('../middlewares/rateLimiter')
const { protect } = require('../middlewares/authMiddleware')

const router = express.Router()

router.post('/register', authLimiter, validateRegister, register)
router.post('/login', authLimiter, validateLogin, login)
router.post('/logout', protect, logout)
router.post('/forgot-password', authLimiter, forgotPasswordHandler)
router.post('/reset-password', resetPasswordHandler)



module.exports = router