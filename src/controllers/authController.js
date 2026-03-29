const jwt = require('jsonwebtoken')
const { registerUser, loginUser, blacklistToken  } = require('../services/authService')

// Controller functions for user registration 
// 1. Call the registerUser service function with the request body.
// 2. If the registration is successful, return a success message and the user object (excluding the password).
// 3. If there is an error, return a 400 status code with the error message.
const register = async (req, res) => {
  try {
    const user = await registerUser(req.body)
    res.status(201).json({ message: 'User created successfully', user })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Controller functions for user login      
// 1. Call the loginUser service function with the request body.
// 2. If the login is successful, generate a JWT token containing the user ID and return it along with the user object (excluding the password).
// 3. If there is an error, return a 400 status code with the error message.
const login = async (req, res) => {
  try {
    const user = await loginUser(req.body)

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({ token, user })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

const logout = async (req, res) => {
  try {
    await blacklistToken(req.token)
    res.json({ message: 'Logged out successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { register, login , logout }