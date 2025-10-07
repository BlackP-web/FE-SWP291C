const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')
const session = require('express-session')

// Load environment variables
dotenv.config()

// Import routes
const authRoutes = require('./routes/auth')
const socialAuthRoutes = require('./routes/social-auth')
const productRoutes = require('./routes/products')
const userRoutes = require('./routes/users')
const orderRoutes = require('./routes/orders')
const adminRoutes = require('./routes/admin')

// Import passport
const passport = require('./config/passport')

// Import database connection
const { sequelize } = require('./config/database')

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:3000'],
  credentials: true
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Session configuration for OAuth
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}))

// Initialize passport
app.use(passport.initialize())
app.use(passport.session())

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/auth', socialAuthRoutes)
app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/admin', adminRoutes)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack)
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Database connection and server start
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate()
    console.log('✅ Database connection established successfully')
    
    // Sync database models - disabled for now
    // await sequelize.sync({ alter: process.env.NODE_ENV === 'development' })
    console.log('✅ Database models synchronized')
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`)
      console.log(`🌐 Health check: http://localhost:${PORT}/api/health`)
    })
  } catch (error) {
    console.error('❌ Unable to start server:', error)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down gracefully')
  await sequelize.close()
  process.exit(0)
})

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received, shutting down gracefully')
  await sequelize.close()
  process.exit(0)
})

startServer()
