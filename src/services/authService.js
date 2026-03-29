const {PrismaClient} = require('@prisma/client'); 
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const bcrypt = require('bcryptjs')

// Service function for user registration  
// 1. Check if the email already exists in the database.
// 2. If it does, throw an error.
// 3. If it doesn't, hash the password using bcrypt.
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
// 1. Find the user by email in the database, If not found, throw an error.
// 3. If the user is found, compare the provided password with the hashed password stored in the database using bcrypt.
// 4. If the passwords do not match, throw an error.
// 5. If the passwords match, return the user object (excluding the password).
const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new Error('Invalid credentials')

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) throw new Error('Invalid credentials')
  return { id: user.id, name: user.name, email: user.email }
}


//------------------ Logout ------
//1. Add the provided token to a blacklist in the database to invalidate it for future use.
//2. Check if a given token is in the blacklist to determine if it has been invalidated.
const blacklistToken = async (token) => {
  await prisma.blacklistedToken.create({ data: { token } })
}

//1. Check if a given token is in the blacklist to determine if it has been invalidated.  
//2. Return true if the token is blacklisted, or false if it is not.
const isTokenBlacklisted = async (token) => {
  const found = await prisma.blacklistedToken.findUnique({ where: { token } })
  return !!found
}

module.exports = { registerUser, loginUser, blacklistToken, isTokenBlacklisted }
