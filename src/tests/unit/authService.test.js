const bcrypt = require('bcryptjs')
const { registerUser, loginUser } = require('../../services/authService')

// Mock Prisma
jest.mock('@prisma/client', () => {
  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn()
    }
  }
  return { PrismaClient: jest.fn(() => mockPrisma) }
})

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

describe('Auth Service', () => {
  
  describe('registerUser', () => {
    it('should create a new user successfully', async () => {
      prisma.user.findUnique.mockResolvedValue(null) // no existing user
      prisma.user.create.mockResolvedValue({
        id: 1,
        name: 'Salma',
        email: 'salma@test.com'
      })

      const result = await registerUser({
        name: 'Salma',
        email: 'salma@test.com',
        password: '123456'
      })

      expect(result).toHaveProperty('id')
      expect(result).toHaveProperty('email', 'salma@test.com')
      expect(result).not.toHaveProperty('password') // never return password!
    })

    it('should throw error if email already exists', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 1, email: 'salma@test.com' })

      await expect(registerUser({
        name: 'Salma',
        email: 'salma@test.com',
        password: '123456'
      })).rejects.toThrow('Email already exists')
    })
  })

  describe('loginUser', () => {
    it('should throw error for wrong password', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 1,
        email: 'salma@test.com',
        password: await bcrypt.hash('correctpassword', 10)
      })

      await expect(loginUser({
        email: 'salma@test.com',
        password: 'wrongpassword'
      })).rejects.toThrow('Invalid credentials')
    })

    it('should throw error if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null)

      await expect(loginUser({
        email: 'nobody@test.com',
        password: '123456'
      })).rejects.toThrow('Invalid credentials')
    })
  })
})