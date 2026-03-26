const express = require('express')
const dotenv = require('dotenv')

dotenv.config()
const authRoutes = require('./routes/authRoutes')

const app = express()

// Middleware
app.use(express.json())


// Routes
app.use('/api/auth', authRoutes)


// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})