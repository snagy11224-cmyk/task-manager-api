const { Queue } = require('bullmq')

const connection = {
  host: 'localhost',
  port: 6379
}

const emailQueue = new Queue('email', { connection })

const addEmailJob = async (type, data) => {
  await emailQueue.add(type, data, {
    attempts: 3,           // retry 3 times if fails
    backoff: {
      type: 'exponential', // wait longer between each retry
      delay: 1000          // start with 1 second
    }
  })
}

module.exports = { emailQueue, addEmailJob }