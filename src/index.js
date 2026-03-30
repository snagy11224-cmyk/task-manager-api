const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const errorHandler = require('./middlewares/errorHandler')
const { initSentry } = require('./utils/sentry')
const { globalLimiter } = require('./middlewares/rateLimiter')
const { connectDB } = require('./config/database')

const helmet = require('helmet')



dotenv.config()

connectDB()

const authRoutes = require('./routes/authRoutes')
const taskRoutes = require('./routes/taskRoutes')


const app = express()

// Sentry
initSentry(app)


// Middleware
app.use(express.json())

// Security middlewares
app.use(helmet())

// Logging and rate limiting
app.use(morgan('dev'))
app.use(globalLimiter)


// Routes
app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' })
})

app.use(errorHandler)

// Start email worker
require('./queues/emailWorker')

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})