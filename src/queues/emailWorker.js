const { Worker } = require('bullmq')
const nodemailer = require('nodemailer')

// Redis connection (on docker)
const connection = {
  host: 'localhost',
  port: 6379
}

// Create a Nodemailer transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

const emailWorker = new Worker('email', async (job) => {
const type = job.name
const data = job.data


  if (type === 'password-reset') {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: data.email,
      subject: 'Password Reset Request',
      html: `
        <h2>Password Reset</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${data.resetLink}">Reset Password</a>
        <p>This link expires in 1 hour.</p>
      `
    })
  }

  if (type === 'welcome') {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: data.email,
      subject: 'Welcome to Task Manager!',
      html: `
        <h2>Welcome ${data.name}! 🎉</h2>
        <p>Your account has been created successfully.</p>
      `
    })
  }

}, { connection })

emailWorker.on('completed', (job) => {
  console.log(`Email job ${job.id} completed`)
})

emailWorker.on('failed', (job, err) => {
  console.log(`Email job ${job.id} failed: ${err.message}`)
})

module.exports = emailWorker