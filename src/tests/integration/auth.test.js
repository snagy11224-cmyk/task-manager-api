require('dotenv').config()

const request = require('supertest')
const express = require('express')
const authRoutes = require('../../routes/authRoutes')
const errorHandler = require('../../middlewares/errorHandler')

const app = express()
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use(errorHandler)

describe('Auth Endpoints', () => {

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Salma',
          email: `salma${Date.now()}@test.com`, // unique email every run
          password: '123456'
        })

      console.log(res.body) 

      expect(res.statusCode).toBe(201)
      expect(res.body).toHaveProperty('user')
      expect(res.body.user).not.toHaveProperty('password')
    })

    it('should fail with invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Salma',
          email: 'notanemail',
          password: '123456'
        })

      expect(res.statusCode).toBe(400)
    })

    it('should fail with short password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Salma',
          email: 'salma@test.com',
          password: '123'
        })

      expect(res.statusCode).toBe(400)
    })
  })

  describe('POST /api/auth/login', () => {
    it('should fail with wrong credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nobody@test.com',
          password: 'wrongpassword'
        })

      expect(res.statusCode).toBe(400)
    })
  })
})