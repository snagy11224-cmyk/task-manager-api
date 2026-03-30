const {PrismaClient} = require('@prisma/client'); 
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const bcrypt = require('bcryptjs')
const crypto = require('crypto')

// Service function for user registration
const registerUser = async ({ name, email, password }) => {
  //whitelisting the fields name, email, password to prevent mass assignment vulnerabilities
  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) throw new Error('Email already exists')

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
  data: {
    name,
    email,
    password: hashedPassword,
  }
})

  return { id: user.id, name: user.name, email: user.email }
}

// Service function for user login
const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new Error('Invalid credentials')

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) throw new Error('Invalid credentials')
  return { id: user.id, name: user.name, email: user.email }
}


//------------------ Logout ------
const blacklistToken = async (token) => {
  await prisma.blacklistedToken.create({ data: { token } })
}
// Service function to check if a token is blacklisted
const isTokenBlacklisted = async (token) => {
  const found = await prisma.blacklistedToken.findUnique({ where: { token } })
  return !!found
}

//------------------- Forgot Password & Reset Password ------
const forgotPassword = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new Error('No user found with this email')
  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex')
  const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
  // Save to DB
  await prisma.user.update({
    where: { email },
    data: { resetToken, resetTokenExpiry }
  })

  return { resetToken, user }
}

const resetPassword = async (token, newPassword) => {
  // Find user with valid token
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: { gt: new Date() } // token not expired
    }
  })

  if (!user) throw new Error('Invalid or expired reset token')
  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10)
  // Update password + clear token
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null
    }
  })

  return { message: 'Password reset successfully' }
}

module.exports = { registerUser, loginUser, blacklistToken, isTokenBlacklisted, forgotPassword, resetPassword }
