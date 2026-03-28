const Sentry = require('@sentry/node')

const initSentry = (app) => {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: 1.0
  })
}

module.exports = { initSentry, Sentry }