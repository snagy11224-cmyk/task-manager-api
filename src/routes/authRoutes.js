const express = require('express')
const { register, login } = require('../controllers/authController')
const { validateRegister, validateLogin } = require('../middlewares/authMiddleware')
const { authLimiter } = require('../middlewares/rateLimiter')


const router = express.Router()

router.post('/register', authLimiter, validateRegister, register)
router.post('/login', authLimiter, validateLogin, login)


module.exports = router