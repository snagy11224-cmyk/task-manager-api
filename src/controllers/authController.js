const jwt = require('jsonwebtoken')
const { registerUser, loginUser, blacklistToken , forgotPassword, resetPassword } = require('../services/authService')
const { addEmailJob } = require('../queues/emailQueue')

// Controller functions for user registration 
const register = async (req, res) => {
  try {
    const user = await registerUser(req.body)
    res.status(201).json({ message: 'User created successfully', user })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Controller functions for user login      
const login = async (req, res) => {
  try {
    const user = await loginUser(req.body)

    const token = jwt.sign(
      { userId: user.id , role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({ token, user })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
// Controller function for user logout
const logout = async (req, res) => {
  try {
    await blacklistToken(req.token)
    res.json({ message: 'Logged out successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
} 
// Controller function for forgot password
const forgotPasswordHandler = async (req, res) => {
  try {
    const { resetToken, user } = await forgotPassword(req.body.email)

    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`

    await addEmailJob('password-reset', {
      email: user.email,
      resetLink
    })

    res.json({ message: 'Password reset email sent' })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
// Controller function for reset password
const resetPasswordHandler = async (req, res) => {
  try {
    const { token, newPassword } = req.body
    const result = await resetPassword(token, newPassword)
    res.json(result)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}


module.exports = { register, login , logout , forgotPasswordHandler, resetPasswordHandler }